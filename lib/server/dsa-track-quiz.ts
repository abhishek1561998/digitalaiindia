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
    question: "Why is there no single 'best' data structure?",
    options: [
      "There is — a hash map beats everything",
      "Every structure is a trade: cheap at some operations and expensive at others, so the best one depends entirely on which operations you do most",
      "It depends only on how much memory you have",
      "Modern languages make the choice irrelevant",
    ],
    correctIndex: 1,
    explanation: "Every structure is a trade: cheap at some operations and expensive at others, so the best one depends entirely on which operations you do most",
  },
  {
    stage: 1,
    question: "Why is reading `arr[999999]` no slower than `arr[0]`?",
    options: [
      "The array caches recent lookups",
      "An array is one contiguous block, so the address is start + index x item size — one multiply and one add, whatever the index",
      "JavaScript optimises large indexes specially",
      "It is slower, just not noticeably",
    ],
    correctIndex: 1,
    explanation: "An array is one contiguous block, so the address is start + index x item size — one multiply and one add, whatever the index",
  },
  {
    stage: 2,
    question: "Why is counting operations more useful than timing code with a stopwatch?",
    options: [
      "Stopwatches aren't precise enough",
      "A timing measures your machine and what else was running; an operation count measures the algorithm itself, which is the only part you can change",
      "Counting is easier to do",
      "Timing only works on small inputs",
    ],
    correctIndex: 1,
    explanation: "A timing measures your machine and what else was running; an operation count measures the algorithm itself, which is the only part you can change",
  },
  {
    stage: 4,
    question: "Binary search must have a sorted array. What else breaks it — and how?",
    options: [
      "Using `<=` in the while condition",
      "Writing `lo = mid` instead of `lo = mid + 1`: when the target is above mid, lo never advances past it and the loop spins forever",
      "Computing the midpoint with subtraction",
      "Returning -1 when nothing is found",
    ],
    correctIndex: 1,
    explanation: "Writing `lo = mid` instead of `lo = mid + 1`: when the target is above mid, lo never advances past it and the loop spins forever",
  },
  {
    stage: 6,
    question: "A sliding window has a loop inside a loop. How can it still be O(n)?",
    options: [
      "It isn't — it's O(n squared)",
      "Each index enters the window once and leaves once, so the total work across both loops is about 2n regardless of how the inner loop looks",
      "The inner loop runs a constant number of times",
      "Because the array is sorted",
    ],
    correctIndex: 1,
    explanation: "Each index enters the window once and leaves once, so the total work across both loops is about 2n regardless of how the inner loop looks",
  },
  {
    stage: 8,
    question: "Why is counting characters faster than sorting both strings to compare them?",
    options: [
      "Sorting is only slow on long strings",
      "Counting is one pass over each string — O(n). Sorting is O(n log n), and it does more work than the question needs",
      "Sorting mutates the input",
      "They're the same complexity",
    ],
    correctIndex: 1,
    explanation: "Counting is one pass over each string — O(n). Sorting is O(n log n), and it does more work than the question needs",
  },
  {
    stage: 9,
    question: "Why does a prefix-sum array start with a leading 0?",
    options: [
      "Style convention",
      "So that a range starting at index 0 can be expressed by the same subtraction as any other range, with no special case",
      "To reserve space for the total",
      "So the array lengths match",
    ],
    correctIndex: 1,
    explanation: "So that a range starting at index 0 can be expressed by the same subtraction as any other range, with no special case",
  },
  {
    stage: 12,
    question: "A monotonic stack has a `while` loop inside a `for` loop. Why isn't that O(n squared)?",
    options: [
      "It is, but n is usually small",
      "Every index is pushed exactly once and popped at most once, so the two loops together do about 2n operations no matter how they nest",
      "The while loop runs at most twice",
      "Because the stack has a maximum size",
    ],
    correctIndex: 1,
    explanation: "Every index is pushed exactly once and popped at most once, so the two loops together do about 2n operations no matter how they nest",
  },
  {
    stage: 13,
    question: "Why does `[10, 9, 1].sort()` return `[1, 10, 9]`?",
    options: [
      "It's a bug in JavaScript",
      "The default comparator converts elements to strings and compares those, and the string '10' sorts before '9'",
      "sort() only works on strings",
      "The array wasn't copied first",
    ],
    correctIndex: 1,
    explanation: "The default comparator converts elements to strings and compares those, and the string '10' sorts before '9'",
  },
  {
    stage: 14,
    question: "Where does the `log n` in merge sort's O(n log n) come from?",
    options: [
      "The merge step",
      "The depth of the splitting — halving repeatedly gives about log n levels, and each level does n work merging",
      "The base case",
      "The recursion overhead",
    ],
    correctIndex: 1,
    explanation: "The depth of the splitting — halving repeatedly gives about log n levels, and each level does n work merging",
  },
  {
    stage: 15,
    question: "Which three questions tell you a recursive function is correct?",
    options: [
      "Does it compile, does it run, does it return",
      "Does it stop, does each call get closer to stopping, and — assuming the recursive call is right — is the whole thing right",
      "Is it tail-recursive, is it memoised, is it pure",
      "How deep does it go, how wide, how fast",
    ],
    correctIndex: 1,
    explanation: "Does it stop, does each call get closer to stopping, and — assuming the recursive call is right — is the whole thing right",
  },
  {
    stage: 17,
    question: "What happens when you insert already-sorted data into a binary search tree?",
    options: [
      "Nothing — the tree rebalances itself",
      "Every node ends up with only a right child, so the tree degenerates into a linked list and search drops from O(log n) to O(n)",
      "Insertion fails",
      "The tree becomes perfectly balanced",
    ],
    correctIndex: 1,
    explanation: "Every node ends up with only a right child, so the tree degenerates into a linked list and search drops from O(log n) to O(n)",
  },
  {
    stage: 18,
    question: "A heap promises less than a BST — parent versus children only, with siblings unordered. Why is that an advantage?",
    options: [
      "It isn't, heaps are just older",
      "The weaker promise is cheaper to restore, so push and pop stay O(log n) while the extreme element is always O(1) to read",
      "Heaps use less memory per node",
      "It allows duplicate values",
    ],
    correctIndex: 1,
    explanation: "The weaker promise is cheaper to restore, so push and pop stay O(log n) while the extreme element is always O(1) to read",
  },
  {
    stage: 20,
    question: "When does BFS stop being enough for shortest paths?",
    options: [
      "When the graph has cycles",
      "When edges have different weights — BFS finds the fewest edges, which stops meaning the lowest total cost, so you need Dijkstra",
      "When the graph is directed",
      "When there are more than 1,000 nodes",
    ],
    correctIndex: 1,
    explanation: "When edges have different weights — BFS finds the fewest edges, which stops meaning the lowest total cost, so you need Dijkstra",
  },
  {
    stage: 21,
    question: "What does the un-choose step in backtracking actually undo?",
    options: [
      "The recursive call",
      "The state change made just before exploring — because the same array and flags are shared across every branch, so a branch must leave them as it found them",
      "The base case check",
      "Nothing; it's defensive",
    ],
    correctIndex: 1,
    explanation: "The state change made just before exploring — because the same array and flags are shared across every branch, so a branch must leave them as it found them",
  },
  {
    stage: 23,
    question: "What does tabulation give you that memoisation doesn't?",
    options: [
      "A faster answer",
      "No call stack — it builds bottom-up, so it can't overflow, and once it's a table you can usually drop all but the last row or two",
      "Correctness on more problems",
      "Automatic memory management",
    ],
    correctIndex: 1,
    explanation: "No call stack — it builds bottom-up, so it can't overflow, and once it's a table you can usually drop all but the last row or two",
  },
  {
    stage: 24,
    question: "Greedy solves interval scheduling correctly but gets coin change wrong. What's the difference?",
    options: [
      "Coin change has more inputs",
      "Interval scheduling has the greedy-choice property — the locally best choice is part of some optimal answer. Coin change doesn't, so taking the biggest coin first can strand you",
      "Coin change needs sorting first",
      "Greedy is never correct; interval scheduling is a coincidence",
    ],
    correctIndex: 1,
    explanation: "Interval scheduling has the greedy-choice property — the locally best choice is part of some optimal answer. Coin change doesn't, so taking the biggest coin first can strand you",
  },
  {
    stage: 3,
    question: "A loop runs n times; inside it, another loop runs n times but breaks early on average after n/2 iterations. What's the overall time complexity?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(2^n)"],
    correctIndex: 2,
    explanation: "Breaking early only changes the constant factor (n/2 instead of n) — it's still proportional to n×n. Constants get dropped in Big-O, so this is still O(n²).",
  },
  {
    stage: 5,
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
    stage: 7,
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
    stage: 10,
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
    stage: 11,
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
    stage: 16,
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
    stage: 19,
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
    stage: 22,
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
    stage: 25,
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
