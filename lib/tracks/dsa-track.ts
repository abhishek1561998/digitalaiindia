// Shared content for the DSA track — used by both /learn/dsa and
// /learn/dsa/course.

import type { Stage, QuizQuestion } from "./types";

export const DSA_QUIZ_QUESTIONS: QuizQuestion[] = [
  { stage: 0, question: "A loop runs n times; inside it, another loop runs n times but breaks early on average after n/2 iterations. What's the overall time complexity?", options: ["O(n)", "O(n log n)", "O(n²)", "O(2^n)"] },
  { stage: 1, question: "Why does the two-pointer technique need sorted (or otherwise ordered) data to work reliably?", options: ["It doesn't — it works on any data", "Because moving a pointer only makes sense to eliminate possibilities if you know which direction increases or decreases the value", "Because arrays must be sorted to be iterated at all", "Because two pointers are just for show — a single pointer always works as well"] },
  { stage: 2, question: "Average-case hash map lookup is O(1). When does it degrade toward O(n)?", options: ["Never — it's always O(1)", "When many keys hash to the same bucket (collisions), turning that bucket into a list you must scan", "Only when the map has fewer than 10 items", "When you use string keys instead of numbers"] },
  { stage: 3, question: "Why does the fast/slow pointer technique guarantee detecting a cycle if one exists?", options: ["It doesn't guarantee it — it's probabilistic", "Because if there's a cycle, the fast pointer (moving 2 steps) will eventually lap the slow pointer (moving 1 step) inside the loop", "Because fast pointers automatically skip cycles", "It only works if you know the cycle length in advance"] },
  { stage: 4, question: "How can two LIFO stacks implement a FIFO queue?", options: ["They can't — it's impossible", "Push onto stack A; when you need to dequeue, if stack B is empty, pour all of A into B (reversing order), then pop from B", "By sorting the stack contents", "By using a stack of size zero"] },
  { stage: 5, question: "Why does an in-order traversal of a binary search tree always produce sorted output?", options: ["It's a coincidence for most trees", "Because BST property (left < node < right) means visiting left-subtree, then node, then right-subtree visits values in ascending order at every level", "Because BSTs store data in sorted arrays internally", "In-order traversal doesn't actually guarantee sorted output"] },
  { stage: 6, question: "Why does BFS guarantee the shortest path on an unweighted graph but DFS doesn't?", options: ["BFS is just faster than DFS", "BFS explores all nodes at distance 1, then all at distance 2, etc. — the first time it reaches the target, it's via the shortest path. DFS dives deep and may find a longer path first", "DFS can't find paths at all", "They're equally reliable for shortest path"] },
  { stage: 7, question: "What two properties make a problem a good candidate for dynamic programming?", options: ["It must involve arrays and be from an interview", "Overlapping subproblems (same subproblem solved repeatedly) and optimal substructure (the optimal solution can be built from optimal solutions to subproblems)", "It must be recursive and slow", "It must have a for loop"] },
  { stage: 8, question: "A problem asks for the shortest sequence of single-letter word transformations from a start word to an end word, where each intermediate step must be a valid word. Which pattern applies?", options: ["Dynamic programming, since it's an optimization problem", "BFS on a graph, where words are nodes and an edge connects words one letter apart — BFS finds the shortest path", "Two-pointer, since we're comparing letters", "Binary search, since we're searching for a word"] },
];

export const DSA_STAGES: Stage[] = [
  {
    num: "00",
    title: "Big-O & how to actually think about complexity",
    time: "Week 1",
    why: "Most people memorize “O(n) good, O(n²) bad” without being able to derive complexity from real code — which means they can't debug a slow function or make an honest tradeoff in an interview.",
    learn: [
      "Deriving time and space complexity directly from nested loops and recursion",
      "Best, worst, and average case — and why interviewers usually mean worst case",
      "Why constant factors get dropped in Big-O, but still matter in the real world",
    ],
    code: `<KW>// O(n) — one pass</KW>
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

<KW>// O(log n) — halves the search space each step</KW>
function binarySearch(sortedArr, target) {
  let lo = 0, hi = sortedArr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (sortedArr[mid] === target) return mid;
    if (sortedArr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
<KW>// Binary search on 1,000,000 items: ~20 comparisons, not 1,000,000</KW>`,
    build: "Take 5 real code snippets and write down their Big-O before checking — nested loops, a loop with a break, a recursive function, an array method chain.",
    check: "What's the time complexity of a loop inside a loop that both run n times, but the inner one breaks early half the time on average?",
  },
  {
    num: "01",
    title: "Arrays & two pointers",
    time: "Week 1–2",
    why: "Two-pointer is the single pattern that shows up in more interview problems than almost any other — but it's usually taught as “just try it” instead of a repeatable recipe.",
    learn: [
      "The two-pointer technique: opposite ends closing in, or same-direction fast/slow",
      "Sliding window as two-pointer's cousin — a window that grows and shrinks",
      "In-place array manipulation without extra memory",
    ],
    code: `<KW>// Two Sum on a SORTED array — O(n), no extra space</KW>
function twoSumSorted(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;   <KW>// need a bigger sum — move left up</KW>
    else right--;               <KW>// need a smaller sum — move right down</KW>
  }
  return null;
}`,
    build: "Implement “remove duplicates from a sorted array in-place” and “container with most water” using two pointers.",
    check: "Why does the two-pointer technique only work reliably on sorted (or otherwise ordered) data?",
  },
  {
    num: "02",
    title: "Hashing & the space-time tradeoff",
    time: "Week 2",
    why: "Hash maps turn O(n²) brute-force problems into O(n) by trading memory for speed. Recognizing WHEN to make that trade — not just how a hash map works — is the actual interview skill.",
    learn: [
      "Hash map/set operations and real average-case O(1) lookup",
      "Collision handling basics, and why worst case isn't actually O(1)",
      "When hashing beats sorting for a given problem",
    ],
    code: `<KW>// Brute force Two Sum — O(n²)</KW>
function twoSumBrute(arr, target) {
  for (let i = 0; i < arr.length; i++)
    for (let j = i + 1; j < arr.length; j++)
      if (arr[i] + arr[j] === target) return [i, j];
}

<KW>// Hash map Two Sum — O(n), one pass</KW>
function twoSumHash(arr, target) {
  const seen = new Map();
  for (let i = 0; i < arr.length; i++) {
    const complement = target - arr[i];
    if (seen.has(complement)) return [seen.get(complement), i];
    seen.set(arr[i], i);
  }
}`,
    build: "Solve “group anagrams” and “first non-repeating character in a string” using a hash map.",
    check: "Why is average-case hash map lookup O(1) but worst-case O(n)? When would you actually hit that worst case?",
  },
  {
    num: "03",
    title: "Linked lists",
    time: "Week 3",
    why: "Linked lists force you to think in pointers/references instead of array indices — exactly the mental shift you need before trees and graphs make sense.",
    learn: [
      "Singly vs. doubly linked lists, and what each pointer actually stores",
      "Fast/slow pointer (Floyd's algorithm) for cycle detection",
      "Reversing a linked list in-place, iteratively",
    ],
    code: `<KW>// Reverse a singly linked list in-place — O(n), O(1) space</KW>
function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    const next = curr.next;  <KW>// save before we overwrite it</KW>
    curr.next = prev;        <KW>// reverse the pointer</KW>
    prev = curr;
    curr = next;
  }
  return prev;  <KW>// prev is now the new head</KW>
}`,
    build: "Detect a cycle in a linked list, and find its middle node — both in a single pass, both with the fast/slow pointer.",
    check: "Why does the fast/slow pointer technique guarantee finding a cycle if one exists?",
  },
  {
    num: "04",
    title: "Stacks & queues",
    time: "Week 3–4",
    why: "Stacks and queues aren't just data structures to memorize — they're the actual mechanism behind recursion, undo/redo, browser history, and BFS.",
    learn: [
      "LIFO vs. FIFO, and matching each to the problems that need them",
      "Using a stack for bracket matching and the monotonic stack pattern",
      "Implementing a FIFO queue with two LIFO stacks",
    ],
    code: `<KW>// Valid parentheses — O(n), using a stack</KW>
function isValid(s) {
  const stack = [];
  const pairs = { ")": "(", "]": "[", "}": "{" };
  for (const ch of s) {
    if (ch === "(" || ch === "[" || ch === "{") stack.push(ch);
    else if (stack.pop() !== pairs[ch]) return false;
  }
  return stack.length === 0;
}`,
    build: "Implement a min-stack (getMin in O(1)), and solve “daily temperatures” using a monotonic stack.",
    check: "Why can you implement a FIFO queue using two LIFO stacks — walk through the mechanism.",
  },
  {
    num: "05",
    title: "Trees & recursion",
    time: "Week 4–5",
    why: "Recursion finally clicks on trees, because the recursive structure IS the data structure — every subtree is itself a complete tree.",
    learn: [
      "Binary tree traversal: in-order, pre-order, post-order",
      "Recursive thinking — a base case plus a recursive case, nothing more",
      "Binary search tree properties and why they matter",
    ],
    code: `<KW>// In-order traversal — visits values in ascending order for a BST</KW>
function inOrder(node, result = []) {
  if (!node) return result;      <KW>// base case</KW>
  inOrder(node.left, result);    <KW>// recurse left</KW>
  result.push(node.val);
  inOrder(node.right, result);   <KW>// recurse right</KW>
  return result;
}`,
    build: "Solve “maximum depth of a binary tree” and “lowest common ancestor” recursively.",
    check: "Why does in-order traversal of a BST always produce sorted output?",
  },
  {
    num: "06",
    title: "Graphs & BFS/DFS",
    time: "Week 5–6",
    why: "Graphs are trees generalized — most “real world” problems (social networks, maps, dependency resolution) are graph problems wearing a disguise.",
    learn: [
      "Adjacency list vs. adjacency matrix, and when to use each",
      "BFS for shortest path on unweighted graphs vs. DFS for exploring/backtracking",
      "Representing a grid as an implicit graph",
    ],
    code: `<KW>// BFS shortest path on an unweighted graph</KW>
function bfsShortestPath(graph, start, target) {
  const queue = [[start, 0]];
  const visited = new Set([start]);
  while (queue.length) {
    const [node, dist] = queue.shift();
    if (node === target) return dist;
    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, dist + 1]);
      }
    }
  }
  return -1;
}`,
    build: "Solve “number of islands” (flood fill with DFS/BFS) and “course schedule” (cycle detection via topological sort).",
    check: "Why does BFS guarantee the shortest path on an unweighted graph but DFS doesn't?",
  },
  {
    num: "07",
    title: "Dynamic programming",
    time: "Week 6–7",
    why: "DP is just “recursion plus memoization” — it feels scary mainly because most courses teach the formula without first showing why naive recursion is slow and what memoization actually fixes.",
    learn: [
      "Overlapping subproblems — the same subproblem gets solved over and over",
      "Memoization (top-down) vs. tabulation (bottom-up)",
      "Recognizing when a problem IS a DP problem",
    ],
    code: `<KW>// Naive recursive Fibonacci — O(2^n), recomputes everything</KW>
function fibNaive(n) {
  if (n <= 1) return n;
  return fibNaive(n - 1) + fibNaive(n - 2);
}

<KW>// Memoized — O(n), each subproblem solved exactly once</KW>
function fibMemo(n, memo = {}) {
  if (n <= 1) return n;
  if (memo[n]) return memo[n];
  return memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
}`,
    build: "Solve “climbing stairs” and 0/1 knapsack — write both the naive recursive version and the memoized version, and compare.",
    check: "What two properties make a problem a good candidate for dynamic programming?",
  },
  {
    num: "08",
    title: "Pattern recognition & mock practice",
    time: "Week 7–8",
    why: "Knowing 8 individual patterns doesn't help if you can't tell WHICH pattern a brand-new, unseen problem needs — that recognition is the actual interview skill, not the patterns themselves.",
    learn: [
      "A repeatable approach: clarify the problem, brute force it, optimize, code it, test it",
      "A pattern checklist — is it sorted? do I need order preserved? is it secretly a graph?",
      "Talking through your thinking out loud, the way a real interview expects",
    ],
    code: `<KW>// Pattern checklist as pseudocode</KW>
if (isSorted || canSort) considerTwoPointer();
if (needsFastLookup) considerHashMap();
if (isTree || isNestedStructure) considerRecursion();
if (isGraphOrGrid) considerBfsOrDfs();
if (hasOverlappingSubproblems) considerDP();
<KW>// The problem rarely announces its pattern — you have to notice it</KW>`,
    build: "Solve 3 fresh problems cold, out loud, using the checklist above — time yourself and note which pattern you reached for first.",
    check: "A problem asks for the shortest sequence of single-letter word transformations from a start word to an end word. Which pattern from this path applies, and why?",
  },
];
