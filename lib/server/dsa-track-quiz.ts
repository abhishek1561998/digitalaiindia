// Server-only quiz bank for the DSA track. Correct answers never ship to
// the client — routes import this via quiz-registry.ts.

export type QuizQuestion = {
  stage: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export const DSA_TRACK_QUIZ: QuizQuestion[] = [
  {
    stage: 0,
    question: "A loop runs n times; inside it, another loop runs n times but breaks early on average after n/2 iterations. What's the overall time complexity?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(2^n)"],
    correctIndex: 2,
    explanation: "Breaking early only changes the constant factor (n/2 instead of n) — it's still proportional to n×n. Constants get dropped in Big-O, so this is still O(n²).",
  },
  {
    stage: 1,
    question: "Why does the two-pointer technique need sorted (or otherwise ordered) data to work reliably?",
    options: [
      "It doesn't — it works on any data",
      "Because moving a pointer only makes sense to eliminate possibilities if you know which direction increases or decreases the value",
      "Because arrays must be sorted to be iterated at all",
      "Because two pointers are just for show — a single pointer always works as well",
    ],
    correctIndex: 1,
    explanation: "The whole trick is: if the sum is too small, moving the left pointer right increases it; if too big, moving the right pointer left decreases it. That only holds because the array is ordered — on unsorted data you can't safely eliminate half the search space that way.",
  },
  {
    stage: 2,
    question: "Average-case hash map lookup is O(1). When does it degrade toward O(n)?",
    options: [
      "Never — it's always O(1)",
      "When many keys hash to the same bucket (collisions), turning that bucket into a list you must scan",
      "Only when the map has fewer than 10 items",
      "When you use string keys instead of numbers",
    ],
    correctIndex: 1,
    explanation: "A hash map is really an array of buckets. If the hash function collides a lot (many keys land in the same bucket), that bucket becomes a linked list you have to scan linearly — worst case, every key collides and you get O(n).",
  },
  {
    stage: 3,
    question: "Why does the fast/slow pointer technique guarantee detecting a cycle if one exists?",
    options: [
      "It doesn't guarantee it — it's probabilistic",
      "Because if there's a cycle, the fast pointer (moving 2 steps) will eventually lap the slow pointer (moving 1 step) inside the loop",
      "Because fast pointers automatically skip cycles",
      "It only works if you know the cycle length in advance",
    ],
    correctIndex: 1,
    explanation: "Think of two runners on a circular track at different speeds — the faster one always eventually catches up to and passes the slower one. Once both pointers are inside the cycle, the gap between them shrinks by 1 every step, so they must meet.",
  },
  {
    stage: 4,
    question: "How can two LIFO stacks implement a FIFO queue?",
    options: [
      "They can't — it's impossible",
      "Push onto stack A; when you need to dequeue, if stack B is empty, pour all of A into B (reversing order), then pop from B",
      "By sorting the stack contents",
      "By using a stack of size zero",
    ],
    correctIndex: 1,
    explanation: "Popping everything off stack A and pushing it onto stack B reverses the order — so the oldest item (bottom of A) ends up on top of B, ready to pop first. That reversal is exactly what turns LIFO into FIFO behavior.",
  },
  {
    stage: 5,
    question: "Why does an in-order traversal of a binary search tree always produce sorted output?",
    options: [
      "It's a coincidence for most trees",
      "Because BST property (left < node < right) means visiting left-subtree, then node, then right-subtree visits values in ascending order at every level",
      "Because BSTs store data in sorted arrays internally",
      "In-order traversal doesn't actually guarantee sorted output",
    ],
    correctIndex: 1,
    explanation: "The BST invariant (everything in the left subtree is smaller, everything in the right is bigger) holds recursively at every node — so visiting left, then the node itself, then right, always produces values in increasing order.",
  },
  {
    stage: 6,
    question: "Why does BFS guarantee the shortest path on an unweighted graph but DFS doesn't?",
    options: [
      "BFS is just faster than DFS",
      "BFS explores all nodes at distance 1, then all at distance 2, etc. — the first time it reaches the target, it's via the shortest path. DFS dives deep and may find a longer path first",
      "DFS can't find paths at all",
      "They're equally reliable for shortest path",
    ],
    correctIndex: 1,
    explanation: "BFS expands outward in layers by distance, so the first time it touches the target node is guaranteed to be via the fewest edges. DFS commits to one path and may reach the target after a long detour, with no guarantee it's the shortest.",
  },
  {
    stage: 7,
    question: "What two properties make a problem a good candidate for dynamic programming?",
    options: [
      "It must involve arrays and be from an interview",
      "Overlapping subproblems (same subproblem solved repeatedly) and optimal substructure (the optimal solution can be built from optimal solutions to subproblems)",
      "It must be recursive and slow",
      "It must have a for loop",
    ],
    correctIndex: 1,
    explanation: "If subproblems don't repeat, memoization buys you nothing — plain recursion is fine. If the optimal solution can't be assembled from optimal sub-solutions (no optimal substructure), DP's core assumption breaks down entirely.",
  },
  {
    stage: 8,
    question: "A problem asks for the shortest sequence of single-letter word transformations from a start word to an end word, where each intermediate step must be a valid word. Which pattern applies?",
    options: [
      "Dynamic programming, since it's an optimization problem",
      "BFS on a graph, where words are nodes and an edge connects words one letter apart — BFS finds the shortest path",
      "Two-pointer, since we're comparing letters",
      "Binary search, since we're searching for a word",
    ],
    correctIndex: 1,
    explanation: "\"Shortest sequence of steps between two things, where steps connect related items\" is the signature of a shortest-path graph problem — model words as nodes, one-letter-apart words as edges, and run BFS.",
  },
];
