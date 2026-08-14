// Shared content for the AWS / Cloud track — used by both /learn/aws and
// /learn/aws/course.
//
// Every stage's `code` block is step-by-step reference (console clicks + CLI),
// and `playground` carries a separate runnable JS exercise, since AWS CLI
// commands can't execute in a browser playground.

import type { Stage, QuizQuestion } from "./types";

export const AWS_QUIZ_QUESTIONS: QuizQuestion[] = [
  { stage: 0, question: "Why should you stop using the root user immediately after creating an AWS account?", options: ["Root is slower than other users", "Root can do absolutely anything including closing the account and changing billing, and its permissions can't be restricted — a leaked root credential is total account compromise with no blast radius limit", "Root only works in one region", "There's no reason, root is fine for daily use"] },
  { stage: 1, question: "Your EC2 instance needs to read from an S3 bucket. Why is attaching an IAM role better than putting an access key on the server?", options: ["Roles are faster than keys", "A role gives the instance temporary credentials that AWS rotates automatically — a long-lived key sitting in a file or env var can be copied, committed to git, and stays valid until someone notices", "There's no difference", "Keys don't work with S3"] },
  { stage: 2, question: "You launched an EC2 instance but can't SSH into it. Which is the most likely cause?", options: ["The instance type is too small", "The security group doesn't allow inbound port 22 from your IP — security groups deny all inbound traffic by default", "EC2 doesn't support SSH", "You need to wait 24 hours"] },
  { stage: 3, question: "What's the practical difference between a security group and a network ACL?", options: ["They're identical, just different names", "Security groups are stateful (return traffic is automatically allowed) and attach to instances; NACLs are stateless (you must allow both directions explicitly) and attach to subnets", "Security groups are for outbound only", "NACLs are the modern replacement for security groups"] },
  { stage: 4, question: "What's the difference between a Docker image and a container?", options: ["They're the same thing", "An image is the immutable blueprint (filesystem + config); a container is a running instance of it — one image can produce many containers, and changes inside a container are lost unless committed or persisted to a volume", "A container is a smaller image", "Images run, containers are stored"] },
  { stage: 5, question: "You push your container image to ECR and want to run it without managing servers. Which is the most direct path?", options: ["Launch an EC2 instance and install Docker manually", "ECS with the Fargate launch type — you supply the task definition and AWS provisions and runs the compute, so there's no instance to patch or scale", "Upload the image to S3", "Lambda is the only option"] },
  { stage: 6, question: "Which workload is a poor fit for Lambda?", options: ["A function that resizes an image on upload", "A long-running video encode that takes 45 minutes — Lambda has a hard 15-minute execution limit, so it would be killed mid-run", "Responding to an API request", "Processing a queue message"] },
  { stage: 7, question: "Why use EventBridge instead of having Service A call Service B's API directly?", options: ["EventBridge is always faster", "It decouples them — A emits an event without knowing who consumes it, so you can add or remove consumers later, and B being down doesn't break A", "Direct API calls don't work in AWS", "EventBridge is cheaper in every case"] },
  { stage: 8, question: "Why is a publicly readable S3 bucket one of the most common causes of real data breaches?", options: ["Public buckets are slow", "'Public' means the entire internet can list and read every object with no credentials — and it's a single checkbox away, so buckets holding backups or user uploads get exposed without anyone noticing", "S3 doesn't support public buckets", "It only affects buckets over 1TB"] },
  { stage: 9, question: "Why run a private package registry like CodeArtifact instead of pulling straight from the public npm registry?", options: ["It's faster in every case", "It gives you a controlled, auditable copy of your dependencies — builds keep working if an upstream package is deleted or yanked, and you can host internal packages that shouldn't be public", "The public npm registry costs money", "It's required by AWS"] },
  { stage: 10, question: "Your AWS bill jumps to ₹15,000 in a month for a small side project. Which is the most likely culprit?", options: ["The EC2 instance itself", "Something running continuously that you forgot about — a NAT Gateway, an idle load balancer, unattached EBS volumes, or old snapshots — these bill hourly whether or not anyone uses the app", "S3 storage of a few files", "Lambda invocations"] },
];

export const AWS_STAGES: Stage[] = [
  {
    num: "00",
    title: "Your AWS account, set up safely",
    time: "Week 1",
    why: "Most people's first AWS experience is either paralysis or a surprise bill. Twenty minutes of setup prevents both — and every stage after this assumes you did it.",
    learn: [
      "Regions and Availability Zones — and why picking the wrong region costs you latency",
      "Root user vs IAM user, and why root is an emergency-only account",
      "Billing alarms and budgets, before you launch anything",
    ],
    code: `STEP 1 — Create the account
  aws.amazon.com → Create an AWS Account
  A card is required even on free tier (identity verification).

STEP 2 — Lock down root IMMEDIATELY
  Account menu → Security credentials
  → Enable MFA (phone authenticator app is fine)
  <KW>Root can close the account and change billing.
  Its permissions cannot be restricted. Protect it.</KW>

STEP 3 — Set a budget BEFORE launching anything
  Billing → Budgets → Create budget
  → Monthly cost budget, e.g. \$5
  → Alert at 80% and 100% to your email
  <KW>This one step prevents almost every horror story.</KW>

STEP 4 — Create your daily-driver IAM user
  IAM → Users → Create user
  → Attach AdministratorAccess (for now — Stage 01 narrows it)
  → Enable MFA on this user too
  → Sign out of root. Use this user from now on.

STEP 5 — Pick your region and stay in it
  ap-south-1 (Mumbai) for Indian users — lowest latency.
  <KW>Resources are region-scoped. An instance in Mumbai is
  invisible from the Ohio console — a classic "where did my
  server go?" moment.</KW>`,
    playground: `// Region choice is a latency decision. Rough round-trip from India:
const regions = {
  "ap-south-1 (Mumbai)":      { rttMs: 25 },
  "ap-southeast-1 (Singapore)": { rttMs: 65 },
  "eu-west-1 (Ireland)":      { rttMs: 130 },
  "us-east-1 (N. Virginia)":  { rttMs: 230 },
};

// A page that makes 6 sequential API calls pays the round trip 6 times:
const callsPerPage = 6;

for (const [name, r] of Object.entries(regions)) {
  const total = r.rttMs * callsPerPage;
  console.log(name.padEnd(28), total + "ms of pure network wait");
}

console.log("\\nSame code. Same instance size. Only the region changed.");`,
    build: "Create the account, enable MFA on root, set a ₹400 (~$5) budget alarm, create an admin IAM user, and sign out of root. Screenshot the budget as proof.",
    check: "Why should you stop using the root user immediately after creating an AWS account?",
  },
  {
    num: "01",
    title: "IAM — who can do what",
    time: "Week 1–2",
    why: "IAM is where AWS security actually lives, and where beginners create the biggest holes: AdministratorAccess on everything, and long-lived access keys committed to git. Getting this right early is far cheaper than retrofitting it.",
    learn: [
      "Users, groups, roles, and policies — what each one is actually for",
      "Least privilege in practice, without grinding development to a halt",
      "Why services get roles, never access keys",
    ],
    code: `THE FOUR THINGS

  User    — a person (you). Has a password / access keys.
  Group   — a bag of users sharing permissions.
  Role    — assumed temporarily. For SERVICES and cross-account.
  Policy  — the JSON that says what's allowed.

STEP 1 — Read a policy (this is the whole language)
  {
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::my-app-uploads/*"
    }]
  }
  <KW>Effect + Action + Resource. That's 90% of IAM.</KW>

STEP 2 — Create a role for EC2 (not a key!)
  IAM → Roles → Create role
  → Trusted entity: AWS service → EC2
  → Attach the policy above
  → Name: ec2-s3-uploads

STEP 3 — Attach it to the instance
  EC2 → select instance → Actions
  → Security → Modify IAM role → pick ec2-s3-uploads

STEP 4 — Verify from inside the instance
  aws s3 ls s3://my-app-uploads
  <KW>No keys anywhere. AWS rotates the credentials for you.</KW>

<KW>NEVER: aws_access_key_id in your code, .env, or Dockerfile.
A leaked key is someone else mining crypto on your card.</KW>`,
    playground: `// Spot the over-permissive policy — this is a real review skill.
const policies = [
  { name: "uploads-rw", Action: ["s3:GetObject", "s3:PutObject"], Resource: "arn:aws:s3:::my-app-uploads/*" },
  { name: "admin-oops", Action: ["*"],                            Resource: "*" },
  { name: "s3-all",     Action: ["s3:*"],                         Resource: "*" },
  { name: "read-logs",  Action: ["logs:GetLogEvents"],            Resource: "arn:aws:logs:*:*:log-group:/app/*" },
];

for (const p of policies) {
  const wildAction = p.Action.some(a => a === "*" || a.endsWith(":*"));
  const wildResource = p.Resource === "*";
  const risk = wildAction && wildResource ? "CRITICAL"
             : wildAction || wildResource ? "review"
             : "ok";
  console.log(p.name.padEnd(12), risk);
}

console.log("\\nLeast privilege = narrow Action AND narrow Resource.");`,
    build: "Create a policy that allows read-only access to exactly one S3 bucket, attach it to a role, and attach that role to an EC2 instance. Confirm it can read that bucket and nothing else.",
    check: "Your EC2 instance needs to read from an S3 bucket. Why is attaching an IAM role better than putting an access key on the server?",
  },
  {
    num: "02",
    title: "EC2 — your first server",
    time: "Week 2",
    why: "EC2 is the most fundamental piece of AWS: a computer you rent by the hour. Almost every higher-level service is a managed abstraction over this, so understanding it makes the rest make sense.",
    learn: [
      "AMIs, instance types and families, and what the letters/numbers mean",
      "Key pairs and SSH — and what to do when you lose the .pem",
      "Security groups, EBS volumes, and the difference between stop and terminate",
    ],
    code: `STEP 1 — Launch
  EC2 → Launch instance
  → AMI: Amazon Linux 2023 (or Ubuntu)
  → Type: t3.micro (free-tier eligible in most accounts)
  → Key pair: create new → download the .pem → KEEP IT
  → Security group: allow SSH (22) from MY IP only
  <KW>Never 0.0.0.0/0 on port 22. Bots scan it within minutes.</KW>

STEP 2 — Connect
  chmod 400 my-key.pem          <KW># SSH refuses loose perms</KW>
  ssh -i my-key.pem ec2-user@<PUBLIC-IP>

STEP 3 — Install something
  sudo dnf update -y
  sudo dnf install -y docker
  sudo systemctl start docker
  sudo usermod -aG docker ec2-user   <KW># re-login to take effect</KW>

STEP 4 — Open a port to serve traffic
  Security group → Edit inbound rules
  → Add: HTTP (80) from 0.0.0.0/0

STEP 5 — Clean up (this is the part people forget)
  Stop      = keeps the disk, stops compute billing
  Terminate = deletes the instance and (usually) its volume
  <KW>A forgotten running instance is the #1 surprise bill.</KW>

INSTANCE TYPE DECODER
  t3.micro → t = burstable family, 3 = generation, micro = size
  t/m general purpose · c compute · r memory · g GPU`,
    playground: `// Stopped instances still cost money for their disk. Do the math.
const hoursInMonth = 730;

const instance = { type: "t3.micro", perHour: 0.0104 };  // ~USD, ap-south-1
const ebsGb = 30, ebsPerGbMonth = 0.08;                  // gp3 storage

const alwaysOn   = instance.perHour * hoursInMonth + ebsGb * ebsPerGbMonth;
const office9to6 = instance.perHour * 9 * 22        + ebsGb * ebsPerGbMonth;
const stopped    = 0                                + ebsGb * ebsPerGbMonth;

console.log("Always on:        $" + alwaysOn.toFixed(2));
console.log("9-6 weekdays:     $" + office9to6.toFixed(2));
console.log("Stopped all month:$" + stopped.toFixed(2), "<- disk still bills!");
console.log("\\nTerminate (not stop) to stop paying for the volume too.");`,
    build: "Launch a t3.micro, SSH in, install Docker, open port 80, then terminate it. Time the whole loop — you should get it under 10 minutes on the second try.",
    check: "You launched an EC2 instance but can't SSH into it. Which is the most likely cause?",
  },
  {
    num: "03",
    title: "Networking — VPC, subnets, security groups",
    time: "Week 2–3",
    why: "\"It works locally but I can't reach it on AWS\" is almost always networking. This stage is the difference between guessing and diagnosing.",
    learn: [
      "VPC, subnets, and what makes a subnet public vs private",
      "Internet Gateway, route tables, and NAT Gateway (the expensive one)",
      "Security groups vs NACLs — stateful vs stateless",
    ],
    code: `THE MENTAL MODEL

  VPC            your own private network in AWS
   ├─ Public subnet   → route table points 0.0.0.0/0 to IGW
   │    └─ things needing a public IP (load balancer, bastion)
   └─ Private subnet  → no route to IGW
        └─ databases, app servers (safer)

<KW>A subnet is "public" ONLY because its route table has an
Internet Gateway route. That's the entire definition.</KW>

SECURITY GROUP vs NACL
                  Security Group        NACL
  Attaches to     instance              subnet
  State           stateful              stateless
  Rules           allow only            allow AND deny
  Return traffic  automatic             must allow explicitly

<KW>Stateful means: allow inbound 443, and the response is
automatically permitted out. With a NACL you'd have to allow
the ephemeral return ports yourself.</KW>

DEBUG CHECKLIST — "I can't reach my instance"
  1. Security group inbound allows your port + source IP?
  2. Instance in a public subnet (route to IGW)?
  3. Instance actually has a public IP?
  4. NACL allows it (default NACL allows all — rarely the cause)
  5. Is the app even listening? (curl localhost from inside)

<KW>NAT Gateway lets private subnets reach the internet OUT.
It bills ~\$32/month plus data. It is the classic
"why is my bill so high" answer.</KW>`,
    playground: `// Debug it the way you would in the console.
function diagnose(c) {
  if (!c.sgAllowsPort) return "Security group: add inbound rule for port " + c.port;
  if (!c.hasPublicIp)  return "No public IP — put it in a public subnet / assign an EIP";
  if (!c.routeToIgw)   return "Subnet has no 0.0.0.0/0 route to an Internet Gateway";
  if (!c.appListening) return "Nothing listening on " + c.port + " — check the app itself";
  return "Should be reachable";
}

const cases = [
  { name: "case A", port: 22, sgAllowsPort: false, hasPublicIp: true,  routeToIgw: true,  appListening: true },
  { name: "case B", port: 80, sgAllowsPort: true,  hasPublicIp: true,  routeToIgw: false, appListening: true },
  { name: "case C", port: 80, sgAllowsPort: true,  hasPublicIp: true,  routeToIgw: true,  appListening: false },
];

cases.forEach(c => console.log(c.name + ":", diagnose(c)));`,
    build: "Create a VPC with one public and one private subnet. Put an instance in each. Confirm the public one is reachable and the private one genuinely isn't.",
    check: "What's the practical difference between a security group and a network ACL?",
  },
  {
    num: "04",
    title: "Docker — packaging your app",
    time: "Week 3",
    why: "\"Works on my machine\" stops being a joke once your app ships as an image. Containers are also the unit almost all modern AWS deployment expects.",
    learn: [
      "Image vs container vs registry — the three things people conflate",
      "Writing a Dockerfile that isn't needlessly huge or slow to rebuild",
      "Ports, volumes, and environment variables",
    ],
    code: `IMAGE vs CONTAINER
  Image     = the blueprint. Immutable. Layered.
  Container = a running instance of an image.
  <KW>One image → many containers. Changes inside a container
  vanish on restart unless written to a volume.</KW>

STEP 1 — A Dockerfile that caches well
  FROM node:20-alpine
  WORKDIR /app

  COPY package*.json ./     <KW># deps layer FIRST</KW>
  RUN npm ci --omit=dev     <KW># cached unless package.json changes</KW>

  COPY . .                  <KW># code changes don't bust deps</KW>
  EXPOSE 3000
  CMD ["node", "server.js"]

  <KW>Copying everything before npm ci reinstalls all
  dependencies on every single code change. Slow builds
  are almost always this mistake.</KW>

STEP 2 — Build and run
  docker build -t my-app:1.0 .
  docker run -p 3000:3000 -e NODE_ENV=production my-app:1.0
                 ↑ host:container

STEP 3 — Look inside a running container
  docker ps
  docker exec -it <container-id> sh
  docker logs -f <container-id>

STEP 4 — .dockerignore (don't ship your junk)
  node_modules
  .git
  .env

<KW>alpine base images are ~5x smaller than the default.
Smaller image = faster pull = faster deploy = lower cost.</KW>`,
    playground: `// Why layer order decides your build time.
const layers = [
  { step: "FROM node:20-alpine", seconds: 0,  changesWhen: "never" },
  { step: "COPY package*.json",  seconds: 1,  changesWhen: "deps change" },
  { step: "RUN npm ci",          seconds: 45, changesWhen: "deps change" },
  { step: "COPY . .",            seconds: 2,  changesWhen: "any code edit" },
];

function rebuild(changed) {
  let busted = false, total = 0;
  for (const l of layers) {
    if (l.changesWhen === changed) busted = true;   // cache breaks here
    if (busted) total += l.seconds;                 // and for everything after
  }
  return total;
}

console.log("Edit one line of code:", rebuild("any code edit") + "s");
console.log("Add a dependency:     ", rebuild("deps change") + "s");
console.log("\\nPut the slow, rarely-changing steps EARLY.");`,
    build: "Containerize any app you've built. Get the image under 200MB, and make a one-line code change rebuild in under 5 seconds.",
    check: "What's the difference between a Docker image and a container?",
  },
  {
    num: "05",
    title: "ECR & ECS Fargate — running containers on AWS",
    time: "Week 3–4",
    why: "This is the actual deployment path most teams use: push an image to a registry, and let AWS run it. Fargate removes the server you'd otherwise have to patch, scale, and babysit.",
    learn: [
      "ECR as your private image registry, and authenticating to it",
      "ECS concepts: cluster, task definition, service",
      "Fargate vs EC2 launch type — what you're actually trading",
    ],
    code: `STEP 1 — Create the registry
  ECR → Create repository → name: my-app

STEP 2 — Authenticate Docker to ECR
  aws ecr get-login-password --region ap-south-1 \\
    | docker login --username AWS \\
      --password-stdin <ACCT>.dkr.ecr.ap-south-1.amazonaws.com

STEP 3 — Tag and push
  docker tag my-app:1.0 \\
    <ACCT>.dkr.ecr.ap-south-1.amazonaws.com/my-app:1.0
  docker push \\
    <ACCT>.dkr.ecr.ap-south-1.amazonaws.com/my-app:1.0

STEP 4 — Task definition (the "how to run it" spec)
  ECS → Task definitions → Create
  → Launch type: Fargate
  → CPU 0.25 vCPU, Memory 0.5 GB
  → Container: image URI from step 3, port 3000
  → Task role: the IAM role your app needs (Stage 01)

STEP 5 — Run it as a service
  ECS → Clusters → Create cluster
  → Create service → your task definition
  → Desired tasks: 1
  → Attach an Application Load Balancer for a stable URL

FARGATE vs EC2 LAUNCH TYPE
  Fargate  no servers to manage, pay per task/second,
           costs more per unit of compute
  EC2      you manage/patch/scale instances,
           cheaper at steady high utilisation

<KW>Start with Fargate. Move to EC2 only when the bill
justifies the operational work.</KW>`,
    playground: `// Fargate vs EC2 — the crossover is a utilisation question.
const HOURS = 730;
const fargate = { vcpuHr: 0.04656, gbHr: 0.00511 };  // ~ap-south-1
const task = { vcpu: 0.25, gb: 0.5 };

const fargatePerTaskMonth = (task.vcpu*fargate.vcpuHr + task.gb*fargate.gbHr) * HOURS;
const ec2Instance = 0.0416 * HOURS;   // t3.medium, always on
const tasksPerInstance = 6;           // rough packing

for (const n of [1, 3, 6, 12, 24]) {
  const f = fargatePerTaskMonth * n;
  const e = Math.ceil(n / tasksPerInstance) * ec2Instance;
  const winner = f < e ? "Fargate" : "EC2";
  console.log(String(n).padStart(2) + " tasks  Fargate $" + f.toFixed(2).padStart(7)
              + "   EC2 $" + e.toFixed(2).padStart(7) + "   -> " + winner);
}
console.log("\\nFew tasks: Fargate wins. Many steady tasks: EC2 wins.");`,
    build: "Push your Stage 04 image to ECR and run it on Fargate behind a load balancer. Get a working public URL, then scale the service to 2 tasks.",
    check: "You push your container image to ECR and want to run it without managing servers. Which is the most direct path?",
  },
  {
    num: "06",
    title: "Lambda — code without servers",
    time: "Week 4",
    why: "Lambda is the cheapest way to run code that isn't running constantly. Knowing its limits is what stops you from forcing it into a job it can't do.",
    learn: [
      "Handler signature, triggers, and the execution model",
      "Cold starts — what causes them and when they actually matter",
      "The hard limits: 15 minutes, memory/CPU coupling, package size",
    ],
    code: `STEP 1 — Create the function
  Lambda → Create function → Author from scratch
  → Runtime: Node.js 20.x
  → Execution role: create new (gets CloudWatch Logs access)

STEP 2 — The handler
  export const handler = async (event) => {
    console.log("Event:", JSON.stringify(event));
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  };
  <KW>event is whatever the trigger sends. Log it first —
  every trigger has a different shape.</KW>

STEP 3 — Configure
  Memory: 512 MB   <KW># CPU scales WITH memory. More RAM = faster.</KW>
  Timeout: 30s     <KW># default is 3s — too short for most real work</KW>
  Environment variables for config (never hardcode)

STEP 4 — Add a trigger
  + Add trigger → API Gateway / S3 / EventBridge / SQS

STEP 5 — Watch it run
  Monitor → View CloudWatch logs
  <KW>console.log goes to CloudWatch. That IS your debugger.</KW>

THE LIMITS THAT MATTER
  15 min max execution      <KW># long jobs → ECS/Batch instead</KW>
  250 MB unzipped package   <KW># big deps → container image Lambda</KW>
  /tmp is ephemeral         <KW># don't store state between calls</KW>

COLD STARTS
  First call after idle loads the runtime: ~100ms–1s.
  <KW>Irrelevant for a nightly job. Very relevant for a
  user-facing API — that's when you consider provisioned
  concurrency or a container instead.</KW>`,
    playground: `// Lambda pricing is GB-seconds. More memory is often CHEAPER,
// because the function finishes proportionally faster.
const PER_GB_SEC = 0.0000166667;
const PER_REQ = 0.0000002;
const invocations = 1_000_000;

// A CPU-bound task: doubling memory roughly halves the duration.
const configs = [
  { mb: 128,  ms: 4000 },
  { mb: 256,  ms: 2000 },
  { mb: 512,  ms: 1000 },
  { mb: 1024, ms: 500 },
];

for (const c of configs) {
  const gbSec = (c.mb / 1024) * (c.ms / 1000) * invocations;
  const cost = gbSec * PER_GB_SEC + invocations * PER_REQ;
  console.log(String(c.mb).padStart(4) + "MB  " + String(c.ms).padStart(4) + "ms  $" + cost.toFixed(2));
}
console.log("\\nSame cost, 8x faster. Under-provisioning memory saves nothing.");`,
    build: "Write a Lambda triggered by an S3 upload that logs the file name and size. Then deliberately set the timeout to 1s and watch it fail — read the error in CloudWatch.",
    check: "Which workload is a poor fit for Lambda?",
  },
  {
    num: "07",
    title: "EventBridge — wiring services together",
    time: "Week 5",
    why: "EventBridge is how AWS services talk without knowing about each other. It replaces both cron jobs and a lot of brittle direct-call plumbing.",
    learn: [
      "Event buses, rules, event patterns, and targets",
      "Scheduled rules as managed cron — without a server to keep alive",
      "Why event-driven decoupling matters more as a system grows",
    ],
    code: `THE MODEL
  Something emits an EVENT → a RULE matches it → TARGETS run

STEP 1 — Scheduled rule (cron, without a server)
  EventBridge → Rules → Create rule
  → Rule type: Schedule
  → cron(0 3 * * ? *)        <KW># 03:00 UTC daily</KW>
  → Target: your Lambda
  <KW>No EC2 to keep running just for crontab.</KW>

STEP 2 — Event pattern rule (react to things)
  {
    "source": ["aws.s3"],
    "detail-type": ["Object Created"],
    "detail": {
      "bucket": { "name": ["my-app-uploads"] }
    }
  }
  <KW>Matches only S3 uploads to that one bucket.</KW>

STEP 3 — Your own custom events
  await eventBridge.putEvents({
    Entries: [{
      Source: "my-app.orders",
      DetailType: "OrderPlaced",
      Detail: JSON.stringify({ orderId, amount }),
    }],
  });

STEP 4 — Add consumers without touching the producer
  Rule A: OrderPlaced → send-confirmation-email
  Rule B: OrderPlaced → update-inventory
  Rule C: OrderPlaced → notify-analytics
  <KW>The order service never learns any of these exist.
  That's the whole point.</KW>

WHY NOT JUST CALL THE API DIRECTLY?
  Direct:  A must know B's address, handle B being down,
           and get redeployed to add C.
  Events:  A emits and forgets. Add or remove consumers
           freely. Failures retry independently.`,
    playground: `// Event patterns are matched field by field. Predict before running.
function matches(pattern, event) {
  return Object.entries(pattern).every(([k, want]) => {
    const got = event[k];
    if (Array.isArray(want)) return want.includes(got);
    if (typeof want === "object") return matches(want, got || {});
    return want === got;
  });
}

const rule = {
  source: ["aws.s3"],
  "detail-type": ["Object Created"],
  detail: { bucket: { name: ["my-app-uploads"] } },
};

const events = [
  { source: "aws.s3", "detail-type": "Object Created", detail: { bucket: { name: "my-app-uploads" } } },
  { source: "aws.s3", "detail-type": "Object Created", detail: { bucket: { name: "other-bucket" } } },
  { source: "aws.s3", "detail-type": "Object Deleted", detail: { bucket: { name: "my-app-uploads" } } },
];

events.forEach((e, i) => console.log("event " + (i+1) + ":", matches(rule, e) ? "MATCH" : "no match"));`,
    build: "Create a scheduled rule that runs a Lambda every 5 minutes and logs the time. Then add a second rule matching a custom event you emit yourself.",
    check: "Why use EventBridge instead of having Service A call Service B's API directly?",
  },
  {
    num: "08",
    title: "S3 & RDS — where your data lives",
    time: "Week 5–6",
    why: "Compute is disposable; data isn't. This stage covers the two services that hold almost everything, and the single misconfiguration behind a large share of real-world breaches.",
    learn: [
      "S3 buckets, objects, storage classes, and bucket policies",
      "Why 'make the bucket public' is almost never the right fix",
      "RDS basics: engines, backups, and public accessibility",
    ],
    code: `S3 — object storage

STEP 1 — Create a bucket
  S3 → Create bucket
  → Block ALL public access: LEAVE IT ON
  <KW>If you're turning this off, you almost certainly want
  CloudFront with an Origin Access Control instead.</KW>

STEP 2 — Serve files safely
  Public bucket    → the whole internet lists + reads everything
  Presigned URL    → time-limited link to ONE object
  CloudFront + OAC → CDN reads privately, users never touch S3

  const url = await getSignedUrl(s3, new GetObjectCommand({
    Bucket: "my-app-uploads", Key: "invoice.pdf",
  }), { expiresIn: 300 });   <KW>// 5 minutes</KW>

STEP 3 — Storage classes = cost control
  Standard              hot data
  Intelligent-Tiering   unpredictable access (safe default)
  Glacier               archives, retrieval takes time

RDS — managed relational database

STEP 4 — Launch
  RDS → Create database → PostgreSQL
  → Template: Free tier (if eligible)
  → Public access: NO
  <KW>Put it in a private subnet. Your app reaches it inside
  the VPC; the internet never should.</KW>

STEP 5 — The settings that save you
  Automated backups: 7 days
  Multi-AZ: production only (doubles cost, survives AZ loss)
  Store the password in Secrets Manager, not in your code

<KW>RDS bills whether or not anyone queries it. A forgotten
db.t3.micro is ~\$15/month of nothing.</KW>`,
    playground: `// Which of these access patterns actually leak data?
const setups = [
  { name: "Public bucket, user uploads",  public: true,  presigned: false, cdn: false },
  { name: "Private + presigned URLs",     public: false, presigned: true,  cdn: false },
  { name: "Private + CloudFront OAC",     public: false, presigned: false, cdn: true  },
  { name: "Public bucket, marketing imgs",public: true,  presigned: false, cdn: false },
];

for (const s of setups) {
  const verdict = s.public
    ? "EXPOSED — anyone can list and read every object"
    : (s.presigned || s.cdn)
      ? "safe — access is brokered and time/route limited"
      : "unreachable — no way to serve it";
  console.log(s.name.padEnd(32), verdict);
}
console.log("\\nNote: even 'just marketing images' leaks your whole object list.");`,
    build: "Upload a file to a fully private S3 bucket and serve it to a browser using a 60-second presigned URL. Confirm the link stops working after it expires.",
    check: "Why is a publicly readable S3 bucket one of the most common causes of real data breaches?",
  },
  {
    num: "09",
    title: "CodeArtifact & CI/CD — reproducible builds",
    time: "Week 6",
    why: "Builds that depend on the public internet break in ways you don't control. A private registry plus a real pipeline is what makes deployments boring — which is the goal.",
    learn: [
      "CodeArtifact as a private, cached package registry",
      "Upstream repositories — proxying npm/PyPI so builds survive upstream changes",
      "CodeBuild and CodePipeline: build → test → push image → deploy",
    ],
    code: `WHY A PRIVATE REGISTRY
  - An upstream package gets yanked → your build still works
  - Internal packages that must not be public
  - Every dependency version is auditable and cached

STEP 1 — Create domain and repository
  CodeArtifact → Create domain: my-org
  → Create repository: npm-store
  → Add upstream: npm-store → public npmjs
  <KW>First request proxies from npm and caches it forever.</KW>

STEP 2 — Point npm at it
  aws codeartifact login --tool npm \\
    --domain my-org --repository npm-store
  <KW>Rewrites .npmrc with a 12-hour token.</KW>

STEP 3 — Publish an internal package
  npm publish        <KW># goes to CodeArtifact, never public</KW>

STEP 4 — buildspec.yml for CodeBuild
  version: 0.2
  phases:
    pre_build:
      commands:
        - aws codeartifact login --tool npm --domain my-org --repository npm-store
        - aws ecr get-login-password | docker login --username AWS --password-stdin $ECR
    build:
      commands:
        - npm ci
        - npm test
        - docker build -t $ECR/my-app:$CODEBUILD_RESOLVED_SOURCE_VERSION .
    post_build:
      commands:
        - docker push $ECR/my-app:$CODEBUILD_RESOLVED_SOURCE_VERSION

STEP 5 — Wire the pipeline
  CodePipeline: Source (GitHub) → Build (CodeBuild) → Deploy (ECS)

<KW>Tag images with the commit SHA, never just :latest.
":latest" makes rollback guesswork — you can't tell which
build is actually running.</KW>`,
    playground: `// Why :latest makes rollbacks impossible.
const deploys = [
  { time: "10:00", tag: "latest", sha: "a1b2c3", healthy: true },
  { time: "11:30", tag: "latest", sha: "d4e5f6", healthy: true },
  { time: "14:15", tag: "latest", sha: "9a8b7c", healthy: false },  // broke prod
];

console.log("Using :latest —");
console.log("  Running image tag:", deploys.at(-1).tag);
console.log("  Roll back to...? Every deploy has the SAME tag.\\n");

console.log("Using commit SHA tags —");
deploys.forEach(d => console.log("  " + d.time, "my-app:" + d.sha, d.healthy ? "ok" : "BROKEN"));
const lastGood = [...deploys].reverse().find(d => d.healthy);
console.log("  Roll back to: my-app:" + lastGood.sha + "  (unambiguous)");`,
    build: "Set up a CodeArtifact repo with an npm upstream, install a package through it, and confirm it appears in the repo's package list.",
    check: "Why run a private package registry like CodeArtifact instead of pulling straight from the public npm registry?",
  },
  {
    num: "10",
    title: "Cost, monitoring & not getting burned",
    time: "Week 6–7",
    why: "The two things that actually end side projects on AWS: a bill nobody expected, and having no idea something broke. Both are preventable with an afternoon of setup.",
    learn: [
      "CloudWatch logs, metrics, and alarms that are worth alerting on",
      "The specific resources that quietly bill forever",
      "Tagging, Cost Explorer, and finding what's actually costing money",
    ],
    code: `THE THINGS THAT BILL WHILE YOU SLEEP

  NAT Gateway            ~\$32/mo + data   <KW>← the usual culprit</KW>
  Load balancer (idle)   ~\$18/mo
  Elastic IP unattached  ~\$3.6/mo         <KW>free ONLY while attached</KW>
  Unattached EBS volumes per GB forever   <KW>terminate ≠ always deletes</KW>
  Old EBS snapshots      per GB forever
  RDS running idle       per hour regardless of queries

STEP 1 — Find what's actually costing you
  Billing → Cost Explorer → Group by: Service
  <KW>Then by Tag, once you're tagging things.</KW>

STEP 2 — Tag everything from day one
  Project = side-project
  Env     = dev | prod
  <KW>Untagged resources are unattributable later.</KW>

STEP 3 — Alarms on symptoms users feel
  CloudWatch → Alarms → Create
  - ALB 5xx count > 10 in 5 min
  - Lambda Errors > 0
  - RDS FreeStorageSpace < 10%
  <KW>Not every CPU spike. Alerts you ignore are worse
  than no alerts.</KW>

STEP 4 — Structured logs, so search works at 3am
  console.log(JSON.stringify({
    level: "error", event: "payment_failed",
    userId, orderId, reason: err.code,
  }));
  <KW>CloudWatch Logs Insights can query JSON fields.
  It cannot usefully query "something went wrong".</KW>

STEP 5 — The monthly habit
  - Cost Explorer, grouped by service
  - Delete unattached volumes + old snapshots
  - Release unused Elastic IPs
  - Shut down anything you launched "just to try"`,
    playground: `// A "small" project bill, itemised. Guess the total first.
const monthly = [
  { item: "t3.micro EC2 (always on)", usd: 7.59 },
  { item: "30GB gp3 volume",          usd: 2.40 },
  { item: "NAT Gateway",              usd: 32.40 },
  { item: "Idle load balancer",       usd: 18.00 },
  { item: "2 unattached EIPs",        usd: 7.20 },
  { item: "Forgotten RDS db.t3.micro",usd: 15.33 },
  { item: "S3 (5GB)",                 usd: 0.12 },
];

let total = 0;
for (const m of monthly) { total += m.usd; console.log(m.item.padEnd(30), "$" + m.usd.toFixed(2)); }

console.log("".padEnd(30, "-"), "-------");
console.log("TOTAL".padEnd(30), "$" + total.toFixed(2), "≈ ₹" + Math.round(total * 88));

const actuallyUsed = monthly[0].usd + monthly[1].usd + monthly[6].usd;
console.log("\\nActually serving traffic: $" + actuallyUsed.toFixed(2));
console.log("Pure waste:               $" + (total - actuallyUsed).toFixed(2));`,
    build: "Open Cost Explorer on your own account, group by service, and write down your top 3 costs. Then find and delete one thing you're paying for and don't use.",
    check: "Your AWS bill jumps to ₹15,000 in a month for a small side project. Which is the most likely culprit?",
  },
];
