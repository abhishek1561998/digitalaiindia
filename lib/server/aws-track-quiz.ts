// Server-only quiz bank for the AWS track. Correct answers never ship to
// the client — routes import this via quiz-registry.ts.

export type QuizQuestion = {
  stage: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export const AWS_TRACK_QUIZ: QuizQuestion[] = [
  {
    stage: 0,
    question: "Why should you stop using the root user immediately after creating an AWS account?",
    options: ["Root is slower than other users", "Root can do absolutely anything including closing the account and changing billing, and its permissions can't be restricted — a leaked root credential is total account compromise with no blast radius limit", "Root only works in one region", "There's no reason, root is fine for daily use"],
    correctIndex: 1,
    explanation: "Every other identity in AWS can be constrained by policy. Root cannot — you can't attach a policy that limits it. That's why root gets MFA, gets used for the handful of tasks that genuinely require it, and otherwise stays logged out.",
  },
  {
    stage: 1,
    question: "Your EC2 instance needs to read from an S3 bucket. Why is attaching an IAM role better than putting an access key on the server?",
    options: ["Roles are faster than keys", "A role gives the instance temporary credentials that AWS rotates automatically — a long-lived key sitting in a file or env var can be copied, committed to git, and stays valid until someone notices", "There's no difference", "Keys don't work with S3"],
    correctIndex: 1,
    explanation: "Roles deliver short-lived credentials through the instance metadata service and rotate them for you. There's no secret to leak, nothing to accidentally commit, and no rotation chore — which is why leaked long-lived keys are one of the most common real AWS incidents.",
  },
  {
    stage: 2,
    question: "You launched an EC2 instance but can't SSH into it. Which is the most likely cause?",
    options: ["The instance type is too small", "The security group doesn't allow inbound port 22 from your IP — security groups deny all inbound traffic by default", "EC2 doesn't support SSH", "You need to wait 24 hours"],
    correctIndex: 1,
    explanation: "Security groups are default-deny inbound. A brand new one allows nothing in, so port 22 has to be opened explicitly — ideally to your IP only, since bots scan for open SSH within minutes of an instance appearing.",
  },
  {
    stage: 3,
    question: "What's the practical difference between a security group and a network ACL?",
    options: ["They're identical, just different names", "Security groups are stateful (return traffic is automatically allowed) and attach to instances; NACLs are stateless (you must allow both directions explicitly) and attach to subnets", "Security groups are for outbound only", "NACLs are the modern replacement for security groups"],
    correctIndex: 1,
    explanation: "Statefulness is the practical difference. Allow inbound 443 on a security group and the response flows out automatically. With a NACL you'd also have to allow the ephemeral return port range — which is exactly the detail people forget when debugging.",
  },
  {
    stage: 4,
    question: "What's the difference between a Docker image and a container?",
    options: ["They're the same thing", "An image is the immutable blueprint (filesystem + config); a container is a running instance of it — one image can produce many containers, and changes inside a container are lost unless committed or persisted to a volume", "A container is a smaller image", "Images run, containers are stored"],
    correctIndex: 1,
    explanation: "Image is to container roughly what a class is to an object. This is why writing files inside a running container and expecting them to survive a restart is a common early mistake — you need a volume for that.",
  },
  {
    stage: 5,
    question: "You push your container image to ECR and want to run it without managing servers. Which is the most direct path?",
    options: ["Launch an EC2 instance and install Docker manually", "ECS with the Fargate launch type — you supply the task definition and AWS provisions and runs the compute, so there's no instance to patch or scale", "Upload the image to S3", "Lambda is the only option"],
    correctIndex: 1,
    explanation: "Fargate is the serverless launch type for ECS: you describe the task, AWS runs it. You pay more per unit of compute than EC2 but eliminate patching, scaling, and capacity planning — usually the right trade until utilisation is high and steady.",
  },
  {
    stage: 6,
    question: "Which workload is a poor fit for Lambda?",
    options: ["A function that resizes an image on upload", "A long-running video encode that takes 45 minutes — Lambda has a hard 15-minute execution limit, so it would be killed mid-run", "Responding to an API request", "Processing a queue message"],
    correctIndex: 1,
    explanation: "The 15-minute ceiling is hard and not raisable. Long jobs belong on ECS, AWS Batch, or an EC2 worker — or need splitting into chunks that each finish well inside the limit.",
  },
  {
    stage: 7,
    question: "Why use EventBridge instead of having Service A call Service B's API directly?",
    options: ["EventBridge is always faster", "It decouples them — A emits an event without knowing who consumes it, so you can add or remove consumers later, and B being down doesn't break A", "Direct API calls don't work in AWS", "EventBridge is cheaper in every case"],
    correctIndex: 1,
    explanation: "With a direct call, A must know B's address, handle B's failures, and be redeployed to add a third consumer. With events, A emits once and any number of consumers subscribe independently — each retrying and failing on its own.",
  },
  {
    stage: 8,
    question: "Why is a publicly readable S3 bucket one of the most common causes of real data breaches?",
    options: ["Public buckets are slow", "'Public' means the entire internet can list and read every object with no credentials — and it's a single checkbox away, so buckets holding backups or user uploads get exposed without anyone noticing", "S3 doesn't support public buckets", "It only affects buckets over 1TB"],
    correctIndex: 1,
    explanation: "There's no login, no rate limit, and no log entry that looks alarming — just an open directory. Presigned URLs or CloudFront with an Origin Access Control give you the same convenience without exposing the bucket itself.",
  },
  {
    stage: 9,
    question: "Why run a private package registry like CodeArtifact instead of pulling straight from the public npm registry?",
    options: ["It's faster in every case", "It gives you a controlled, auditable copy of your dependencies — builds keep working if an upstream package is deleted or yanked, and you can host internal packages that shouldn't be public", "The public npm registry costs money", "It's required by AWS"],
    correctIndex: 1,
    explanation: "Once a version is cached in your repository, an upstream deletion or a network problem can't break your build. You also get one auditable place to see exactly which dependency versions your builds consume, plus somewhere to publish internal packages.",
  },
  {
    stage: 10,
    question: "Your AWS bill jumps to ₹15,000 in a month for a small side project. Which is the most likely culprit?",
    options: ["The EC2 instance itself", "Something running continuously that you forgot about — a NAT Gateway, an idle load balancer, unattached EBS volumes, or old snapshots — these bill hourly whether or not anyone uses the app", "S3 storage of a few files", "Lambda invocations"],
    correctIndex: 1,
    explanation: "A t3.micro is a few hundred rupees a month; a NAT Gateway alone is roughly ten times that, and it bills identically at zero traffic. Surprise bills are nearly always idle infrastructure, not the compute actually serving users.",
  },
];
