// Shared content for the DSA track — used by both /learn/dsa and
// /learn/dsa/course.

import type { Stage, QuizQuestion } from "./types";

export const DSA_QUIZ_QUESTIONS: QuizQuestion[] = [
  { stage: 0, question: "Why is there no single 'best' data structure?", options: ["There is — a hash map beats everything", "Every structure is a trade: cheap at some operations and expensive at others, so the best one depends entirely on which operations you do most", "It depends only on how much memory you have", "Modern languages make the choice irrelevant"] },
  { stage: 1, question: "Why is reading `arr[999999]` no slower than `arr[0]`?", options: ["The array caches recent lookups", "An array is one contiguous block, so the address is start + index x item size — one multiply and one add, whatever the index", "JavaScript optimises large indexes specially", "It is slower, just not noticeably"] },
  { stage: 2, question: "Why is counting operations more useful than timing code with a stopwatch?", options: ["Stopwatches aren't precise enough", "A timing measures your machine and what else was running; an operation count measures the algorithm itself, which is the only part you can change", "Counting is easier to do", "Timing only works on small inputs"] },
  { stage: 4, question: "Binary search must have a sorted array. What else breaks it — and how?", options: ["Using `<=` in the while condition", "Writing `lo = mid` instead of `lo = mid + 1`: when the target is above mid, lo never advances past it and the loop spins forever", "Computing the midpoint with subtraction", "Returning -1 when nothing is found"] },
  { stage: 6, question: "A sliding window has a loop inside a loop. How can it still be O(n)?", options: ["It isn't — it's O(n squared)", "Each index enters the window once and leaves once, so the total work across both loops is about 2n regardless of how the inner loop looks", "The inner loop runs a constant number of times", "Because the array is sorted"] },
  { stage: 8, question: "Why is counting characters faster than sorting both strings to compare them?", options: ["Sorting is only slow on long strings", "Counting is one pass over each string — O(n). Sorting is O(n log n), and it does more work than the question needs", "Sorting mutates the input", "They're the same complexity"] },
  { stage: 9, question: "Why does a prefix-sum array start with a leading 0?", options: ["Style convention", "So that a range starting at index 0 can be expressed by the same subtraction as any other range, with no special case", "To reserve space for the total", "So the array lengths match"] },
  { stage: 12, question: "A monotonic stack has a `while` loop inside a `for` loop. Why isn't that O(n squared)?", options: ["It is, but n is usually small", "Every index is pushed exactly once and popped at most once, so the two loops together do about 2n operations no matter how they nest", "The while loop runs at most twice", "Because the stack has a maximum size"] },
  { stage: 13, question: "Why does `[10, 9, 1].sort()` return `[1, 10, 9]`?", options: ["It's a bug in JavaScript", "The default comparator converts elements to strings and compares those, and the string '10' sorts before '9'", "sort() only works on strings", "The array wasn't copied first"] },
  { stage: 14, question: "Where does the `log n` in merge sort's O(n log n) come from?", options: ["The merge step", "The depth of the splitting — halving repeatedly gives about log n levels, and each level does n work merging", "The base case", "The recursion overhead"] },
  { stage: 15, question: "Which three questions tell you a recursive function is correct?", options: ["Does it compile, does it run, does it return", "Does it stop, does each call get closer to stopping, and — assuming the recursive call is right — is the whole thing right", "Is it tail-recursive, is it memoised, is it pure", "How deep does it go, how wide, how fast"] },
  { stage: 17, question: "What happens when you insert already-sorted data into a binary search tree?", options: ["Nothing — the tree rebalances itself", "Every node ends up with only a right child, so the tree degenerates into a linked list and search drops from O(log n) to O(n)", "Insertion fails", "The tree becomes perfectly balanced"] },
  { stage: 18, question: "A heap promises less than a BST — parent versus children only, with siblings unordered. Why is that an advantage?", options: ["It isn't, heaps are just older", "The weaker promise is cheaper to restore, so push and pop stay O(log n) while the extreme element is always O(1) to read", "Heaps use less memory per node", "It allows duplicate values"] },
  { stage: 20, question: "When does BFS stop being enough for shortest paths?", options: ["When the graph has cycles", "When edges have different weights — BFS finds the fewest edges, which stops meaning the lowest total cost, so you need Dijkstra", "When the graph is directed", "When there are more than 1,000 nodes"] },
  { stage: 21, question: "What does the un-choose step in backtracking actually undo?", options: ["The recursive call", "The state change made just before exploring — because the same array and flags are shared across every branch, so a branch must leave them as it found them", "The base case check", "Nothing; it's defensive"] },
  { stage: 23, question: "What does tabulation give you that memoisation doesn't?", options: ["A faster answer", "No call stack — it builds bottom-up, so it can't overflow, and once it's a table you can usually drop all but the last row or two", "Correctness on more problems", "Automatic memory management"] },
  { stage: 24, question: "Greedy solves interval scheduling correctly but gets coin change wrong. What's the difference?", options: ["Coin change has more inputs", "Interval scheduling has the greedy-choice property — the locally best choice is part of some optimal answer. Coin change doesn't, so taking the biggest coin first can strand you", "Coin change needs sorting first", "Greedy is never correct; interval scheduling is a coincidence"] },
  { stage: 3, question: "A loop runs n times; inside it, another loop runs n times but breaks early on average after n/2 iterations. What's the overall time complexity?", options: ["O(n)", "O(n log n)", "O(n²)", "O(2^n)"] },
  { stage: 5, question: "Why does the two-pointer technique need sorted (or otherwise ordered) data to work reliably?", options: ["It doesn't — it works on any data", "Because moving a pointer only makes sense to eliminate possibilities if you know which direction increases or decreases the value", "Because arrays must be sorted to be iterated at all", "Because two pointers are just for show — a single pointer always works as well"] },
  { stage: 7, question: "Average-case hash map lookup is O(1). When does it degrade toward O(n)?", options: ["Never — it's always O(1)", "When many keys hash to the same bucket (collisions), turning that bucket into a list you must scan", "Only when the map has fewer than 10 items", "When you use string keys instead of numbers"] },
  { stage: 10, question: "Why does the fast/slow pointer technique guarantee detecting a cycle if one exists?", options: ["It doesn't guarantee it — it's probabilistic", "Because if there's a cycle, the fast pointer (moving 2 steps) will eventually lap the slow pointer (moving 1 step) inside the loop", "Because fast pointers automatically skip cycles", "It only works if you know the cycle length in advance"] },
  { stage: 11, question: "How can two LIFO stacks implement a FIFO queue?", options: ["They can't — it's impossible", "Push onto stack A; when you need to dequeue, if stack B is empty, pour all of A into B (reversing order), then pop from B", "By sorting the stack contents", "By using a stack of size zero"] },
  { stage: 16, question: "Why does an in-order traversal of a binary search tree always produce sorted output?", options: ["It's a coincidence for most trees", "Because BST property (left < node < right) means visiting left-subtree, then node, then right-subtree visits values in ascending order at every level", "Because BSTs store data in sorted arrays internally", "In-order traversal doesn't actually guarantee sorted output"] },
  { stage: 19, question: "Why does BFS guarantee the shortest path on an unweighted graph but DFS doesn't?", options: ["BFS is just faster than DFS", "BFS explores all nodes at distance 1, then all at distance 2, etc. — the first time it reaches the target, it's via the shortest path. DFS dives deep and may find a longer path first", "DFS can't find paths at all", "They're equally reliable for shortest path"] },
  { stage: 22, question: "What two properties make a problem a good candidate for dynamic programming?", options: ["It must involve arrays and be from an interview", "Overlapping subproblems (same subproblem solved repeatedly) and optimal substructure (the optimal solution can be built from optimal solutions to subproblems)", "It must be recursive and slow", "It must have a for loop"] },
  { stage: 25, question: "A problem asks for the shortest sequence of single-letter word transformations from a start word to an end word, where each intermediate step must be a valid word. Which pattern applies?", options: ["Dynamic programming, since it's an optimization problem", "BFS on a graph, where words are nodes and an edge connects words one letter apart — BFS finds the shortest path", "Two-pointer, since we're comparing letters", "Binary search, since we're searching for a word"] },
];

export const DSA_STAGES: Stage[] = [
  {
    num: "00",
    title: "What a data structure even is",
    time: "8 min",
    why: "Before any of the names — arrays, trees, graphs — one idea. A data structure is a decision about how to arrange data so that the operations you do most often are cheap. Every structure in this track is a different answer to 'cheap at what?'",
    learn: [
      "A structure is a trade: fast at some operations, slow at others",
      "The four operations everything is judged on: read, search, insert, delete",
      "Why there is no best structure, only a best structure for your access pattern",
    ],
    code: `<KW>// Same 5 names, two arrangements, two very different costs.</KW>

<KW>// A list: reading position 3 is instant. Finding "Meera" means looking.</KW>
const list = ["Asha", "Ravi", "Meera", "Dev", "Priya"];
list[3];                    <KW>// instant</KW>
list.indexOf("Meera");      <KW>// has to check each one</KW>

<KW>// A lookup table: finding by name is instant. There is no "position 3".</KW>
const byName = { Asha: 1, Ravi: 2, Meera: 3, Dev: 4, Priya: 5 };
byName["Meera"];            <KW>// instant</KW>
<KW>// byName[3]             ← meaningless here</KW>`,
    build: "Write down three things your phone's contacts app does — open the list, search a name, add a contact. For each, say which arrangement above would be faster and why.",
    check: "Why is there no single 'best' data structure — what does the answer always depend on?",
  },
  {
    num: "01",
    title: "How a list actually sits in memory",
    time: "10 min",
    why: "Almost every complexity result in this track follows from one physical fact: an array is a contiguous block, so the machine can jump straight to any index by arithmetic. Once you can picture that, half the Big-O table stops needing memorisation.",
    learn: [
      "Contiguous memory, and why index access is a single calculation",
      "Why inserting at the front means shifting everything after it",
      "Fixed size versus growable, and what 'amortised' means when an array resizes",
    ],
    code: `<KW>// address = start + (index x size of one item)</KW>
<KW>// That is one multiply and one add — the same cost whatever the index.</KW>
arr[0];        <KW>// O(1)</KW>
arr[999999];   <KW>// O(1) — genuinely the same</KW>

<KW>// But inserting at the front has to move every later item along:</KW>
arr.unshift("new");   <KW>// O(n)</KW>
arr.push("new");      <KW>// O(1) most of the time</KW>

<KW>// "Most of the time": when it runs out of room the array is copied</KW>
<KW>// into a bigger block. Rare, and cheap when averaged out — amortised O(1).</KW>`,
    build: "Time pushing 100,000 items onto an array versus unshifting 100,000 items. Predict the ratio before you run it, then explain the number you got.",
    check: "Why is reading `arr[999999]` no slower than `arr[0]`, and why is `unshift` so much worse than `push`?",
  },
  {
    num: "02",
    title: "Measuring work",
    time: "10 min",
    why: "A stopwatch measures your laptop, your browser and what else was running. Counting the operations an algorithm performs as the input grows measures the algorithm — which is the only part you can actually fix.",
    learn: [
      "Counting operations as a function of input size n",
      "Why constants and slower-growing terms stop mattering as n grows",
      "Best, worst and average case, and which one you should design against",
    ],
    code: `<KW>// How many times does the inner line run, in terms of n?</KW>

function a(arr) {
  return arr[0];                    <KW>// 1 — whatever n is</KW>
}

function b(arr) {
  for (const x of arr) check(x);    <KW>// n times</KW>
}

function c(arr) {
  for (const x of arr)
    for (const y of arr) check(x, y);  <KW>// n x n</KW>
}

<KW>// n = 1,000  →  1  vs  1,000  vs  1,000,000</KW>
<KW>// That gap is why the constant in front stops mattering.</KW>`,
    build: "For each of the three functions, work out the count for n = 10, 100 and 1,000. Write the numbers in a table — the shape of the growth is the lesson.",
    check: "Why is counting operations more useful than timing the code with a stopwatch?",
  },
  {
    num: "03",
    title: "Big-O & how to actually think about complexity",
    time: "14 min",
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
    num: "04",
    title: "Searching: linear and binary",
    time: "12 min",
    why: "Binary search is the first algorithm where a small idea buys an enormous amount, and it is the clearest possible demonstration of what O(log n) means. It is also the most commonly mis-implemented algorithm in interviews.",
    learn: [
      "Linear search, and when it's genuinely the right answer",
      "Binary search: halving the space, and the sorted precondition",
      "The off-by-one traps: which bound moves, and the overflow-safe midpoint",
    ],
    code: `function binarySearch(sorted, target) {
  let lo = 0;
  let hi = sorted.length - 1;

  while (lo <= hi) {                       <KW>// <= , not < </KW>
    const mid = lo + Math.floor((hi - lo) / 2);  <KW>// not (lo+hi)/2</KW>
    if (sorted[mid] === target) return mid;
    if (sorted[mid] < target) lo = mid + 1;      <KW>// move past mid</KW>
    else hi = mid - 1;
  }
  return -1;
}

<KW>// 1,000,000 items: linear takes up to a million checks, binary takes 20.</KW>`,
    build: "Implement binary search from memory, then test it on an empty array, a one-item array, and a target that isn't present. Those three cases catch nearly every bug in it.",
    check: "What must be true of the array before binary search works, and what goes wrong if you write `lo = mid` instead of `lo = mid + 1`?",
  },
  {
    num: "05",
    title: "Arrays & two pointers",
    time: "14 min",
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
    num: "06",
    title: "Sliding window",
    time: "12 min",
    why: "The moment a question says 'contiguous subarray' or 'substring', the naive answer is O(n squared) and the intended answer is a window that grows and shrinks. It is the highest-frequency pattern in interviews after two pointers.",
    learn: [
      "Fixed-size windows: add the incoming, remove the outgoing",
      "Variable windows: grow until invalid, then shrink from the left",
      "Recognising the shape — 'longest/shortest subarray such that...'",
    ],
    code: `<KW>// Longest substring with no repeated character.</KW>
function longestUnique(s) {
  const seen = new Map();
  let left = 0, best = 0;

  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    <KW>// If we've seen c inside the window, jump left past it.</KW>
    if (seen.has(c) && seen.get(c) >= left) {
      left = seen.get(c) + 1;
    }
    seen.set(c, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}
<KW>// Each index enters and leaves the window once → O(n), not O(n squared).</KW>`,
    build: "Solve 'maximum sum of any k consecutive numbers' with a fixed window. Then do it the naive way and compare the operation counts at n = 10,000.",
    check: "How can a loop inside a loop still be O(n)? What has to be true about how the pointers move?",
  },
  {
    num: "07",
    title: "Hashing & the space-time tradeoff",
    time: "14 min",
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
    num: "08",
    title: "Sets and frequency counting",
    time: "10 min",
    why: "An enormous number of problems reduce to 'have I seen this before?' or 'how many of each?'. Both are one pass and one structure — and recognising them saves you from writing a nested loop that didn't need to exist.",
    learn: [
      "Set for membership, Map for counts",
      "The frequency-map pattern, and comparing two of them",
      "Why sorting to compare is O(n log n) when counting is O(n)",
    ],
    code: `<KW>// Anagram check, without sorting either string.</KW>
function isAnagram(a, b) {
  if (a.length !== b.length) return false;

  const counts = new Map();
  for (const c of a) counts.set(c, (counts.get(c) ?? 0) + 1);

  for (const c of b) {
    if (!counts.has(c)) return false;
    counts.set(c, counts.get(c) - 1);
    if (counts.get(c) === 0) counts.delete(c);
  }
  return counts.size === 0;
}

<KW>// Sorting both: O(n log n). Counting: O(n). Same answer.</KW>`,
    build: "Find the first character in a string that never repeats — in one pass to count, one pass to check.",
    check: "When is a Set the right choice over a Map, and why is counting faster than sorting to compare?",
  },
  {
    num: "09",
    title: "Prefix sums",
    time: "12 min",
    why: "Pay once up front, then answer any range-sum question instantly. It is the cleanest example of precomputation in the whole track, and it generalises to counts, XORs and 2D grids.",
    learn: [
      "Building the prefix array in one pass",
      "Any range sum as a single subtraction",
      "When precomputing is worth it — and when it isn't",
    ],
    code: `<KW>// prefix[i] = sum of everything before index i</KW>
function buildPrefix(nums) {
  const prefix = [0];
  for (const n of nums) prefix.push(prefix[prefix.length - 1] + n);
  return prefix;
}

const nums = [3, 1, 4, 1, 5];
const prefix = buildPrefix(nums);   <KW>// [0, 3, 4, 8, 9, 14]</KW>

<KW>// Sum of nums[1..3] — one subtraction, no loop.</KW>
prefix[4] - prefix[1];              <KW>// 9 - 3 = 6</KW>

<KW>// One O(n) build, then every query is O(1).</KW>
<KW>// Worth it for many queries; pointless for one.</KW>`,
    build: "Given an array and 1,000 range-sum queries, solve it both ways and count the operations. Find the number of queries where prefix sums start paying for themselves.",
    check: "Why does the prefix array start with a 0, and what would break without it?",
  },
  {
    num: "10",
    title: "Linked lists",
    time: "14 min",
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
    num: "11",
    title: "Stacks & queues",
    time: "14 min",
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
    num: "12",
    title: "Monotonic stacks and deques",
    time: "12 min",
    why: "This is the pattern behind 'next greater element', 'largest rectangle' and 'sliding window maximum' — questions that look like they need a nested loop and don't. The trick is keeping the stack sorted as an invariant.",
    learn: [
      "Keeping a stack increasing or decreasing, and what that buys",
      "Why each element is pushed and popped at most once — hence O(n)",
      "Deques: a queue you can push and pop at both ends",
    ],
    code: `<KW>// For each element, the next one bigger than it.</KW>
function nextGreater(nums) {
  const out = new Array(nums.length).fill(-1);
  const stack = [];   <KW>// holds indexes, values decreasing</KW>

  for (let i = 0; i < nums.length; i++) {
    <KW>// Anything smaller than nums[i] has found its answer.</KW>
    while (stack.length && nums[stack[stack.length - 1]] < nums[i]) {
      out[stack.pop()] = nums[i];
    }
    stack.push(i);
  }
  return out;
}

<KW>// The while looks like a nested loop, but every index is pushed</KW>
<KW>// once and popped once — 2n operations total, so O(n).</KW>`,
    build: "Use a deque to solve 'maximum in every window of size k' in O(n). Compare against recomputing the max per window.",
    check: "The inner while loop makes this look like O(n squared). Why isn't it?",
  },
  {
    num: "13",
    title: "What sort() actually does",
    time: "12 min",
    why: "You will almost never write a sort. You will constantly rely on one, and be caught out by its two surprises: the default comparator sorts as text, and whether it's stable changes your answer when keys tie.",
    learn: [
      "Why `[10, 9, 1].sort()` gives [1, 10, 9], and how to fix it",
      "Comparator contracts: negative, zero, positive",
      "Stability, and when sorting by two keys needs it",
    ],
    code: `[10, 9, 1].sort();              <KW>// [1, 10, 9] — compared as strings</KW>
[10, 9, 1].sort((a, b) => a - b);  <KW>// [1, 9, 10]</KW>

<KW>// Objects, by one field then another:</KW>
people.sort((a, b) => a.score - b.score || a.name.localeCompare(b.name));

<KW>// Stability means equal elements keep their original order — which is</KW>
<KW>// what lets you sort by name first, then by score, and keep both.</KW>

<KW>// sort mutates. Copy first if the original matters:</KW>
const sorted = [...people].sort(byScore);`,
    build: "Sort a list of objects by two keys, once relying on stability and once with a combined comparator. Convince yourself both give the same answer.",
    check: "Why does `[10, 9, 1].sort()` put 10 before 9?",
  },
  {
    num: "14",
    title: "Merge sort and divide & conquer",
    time: "14 min",
    why: "Merge sort is worth writing once even though you'll never ship it, because the shape — split, solve each half, combine — is the shape of binary search, quicksort, and half of the tree recursion coming next.",
    learn: [
      "Split, recurse, merge — and why the merge is the real work",
      "Where the log n comes from: the depth of the splitting",
      "The space cost merge sort pays that an in-place sort doesn't",
    ],
    code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;          <KW>// base case</KW>

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(a, b) {
  const out = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    out.push(a[i] <= b[j] ? a[i++] : b[j++]);   <KW>// <= keeps it stable</KW>
  }
  return out.concat(a.slice(i), b.slice(j));
}

<KW>// log n levels of splitting, n work merging each level → O(n log n)</KW>`,
    build: "Write mergeSort and add a counter to the merge function. Check that the total count really is about n log n for n = 8, 16 and 32.",
    check: "Where does the `log n` in O(n log n) come from — the splitting or the merging?",
  },
  {
    num: "15",
    title: "Trusting the recursive call",
    time: "14 min",
    why: "Recursion feels like magic until you stop trying to trace it. The working model is: trust the recursive call to be correct, handle the base case, and make sure every call moves towards it. Everything after this lesson depends on that trust.",
    learn: [
      "Base case and recursive case — and what happens with a missing base",
      "The call stack, and why deep recursion overflows it",
      "Trusting the recursion instead of unrolling it in your head",
    ],
    code: `function sum(arr, i = 0) {
  if (i === arr.length) return 0;      <KW>// base case</KW>
  return arr[i] + sum(arr, i + 1);     <KW>// trust this to be right</KW>
}

<KW>// Don't trace it. Ask three questions:</KW>
<KW>//   1. Does it stop?          i reaches arr.length</KW>
<KW>//   2. Does it get closer?    i + 1, every call</KW>
<KW>//   3. If the call is right,  arr[i] + (sum of the rest) — yes</KW>
<KW>//      is the whole right?</KW>

<KW>// Each pending call is a stack frame. ~10,000 deep and it overflows.</KW>`,
    build: "Write a recursive function that reverses a string, then one that counts the files in a nested folder object. Answer the three questions for both before running them.",
    check: "What are the three questions that tell you a recursive function is correct?",
  },
  {
    num: "16",
    title: "Trees & recursion",
    time: "14 min",
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
    num: "17",
    title: "Binary search trees",
    time: "12 min",
    why: "A BST is binary search made into a structure. It also carries the most important caveat in the track: those O(log n) guarantees hold only while the tree stays balanced, and inserting sorted data destroys that immediately.",
    learn: [
      "The BST property, and why an in-order traversal comes out sorted",
      "Search, insert and delete — and the three delete cases",
      "Degenerate trees: how sorted input turns a BST into a linked list",
    ],
    code: `function search(node, target) {
  if (!node) return null;
  if (target === node.value) return node;
  <KW>// The property is what lets you discard half the tree.</KW>
  return target < node.value
    ? search(node.left, target)
    : search(node.right, target);
}

<KW>// In-order traversal of a BST is sorted, for free:</KW>
function inOrder(node, out = []) {
  if (!node) return out;
  inOrder(node.left, out);
  out.push(node.value);
  inOrder(node.right, out);
  return out;
}

<KW>// Insert 1,2,3,4,5 in order and every node has only a right child.</KW>
<KW>// That's a linked list wearing a tree costume — O(n), not O(log n).</KW>`,
    build: "Build a BST from shuffled numbers and print its depth. Then build one from the same numbers sorted. Compare the two depths.",
    check: "What happens to a BST's performance if you insert already-sorted data, and why?",
  },
  {
    num: "18",
    title: "Heaps and priority queues",
    time: "12 min",
    why: "When the question is 'the k largest', 'the next task to run' or 'the closest point', a heap is the answer. It gives you the extreme element in O(1) and maintains that in O(log n) — and it's how Dijkstra stays fast.",
    learn: [
      "The heap property, and why it's weaker than a BST's",
      "A heap as an array: children of i live at 2i+1 and 2i+2",
      "Sift up and sift down, and the top-k pattern",
    ],
    code: `<KW>// A heap only promises: parent <= both children (min-heap).</KW>
<KW>// Siblings are unordered — that weaker promise is why it's cheap.</KW>

<KW>//        1              stored as: [1, 3, 2, 7, 5]</KW>
<KW>//      /   \\            children of i: 2i+1, 2i+2</KW>
<KW>//     3     2           parent of i:  (i-1)/2, floored</KW>
<KW>//    / \\</KW>
<KW>//   7   5</KW>

<KW>// Top-k without sorting everything:</KW>
<KW>// keep a min-heap of size k; if a new item beats the root, swap it in.</KW>
<KW>// O(n log k) instead of O(n log n) — and k is usually tiny.</KW>`,
    build: "Implement a min-heap with push and pop, then use it to find the 10 largest numbers in a list of 100,000 without sorting the list.",
    check: "Why is a heap cheaper to maintain than a BST, given it promises less?",
  },
  {
    num: "19",
    title: "Graphs & BFS/DFS",
    time: "14 min",
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
    num: "20",
    title: "Shortest paths",
    time: "14 min",
    why: "BFS finds the fewest edges. The moment edges have different weights — distance, time, cost — that stops being true, and you need Dijkstra. Knowing exactly where BFS stops working is the point of this lesson.",
    learn: [
      "Why BFS is already shortest-path on an unweighted graph",
      "Dijkstra: a BFS that visits by cheapest-so-far, using a heap",
      "Where Dijkstra fails — negative edges — and what to use instead",
    ],
    code: `<KW>// Dijkstra: BFS, but the queue is a min-heap keyed on distance.</KW>
function dijkstra(graph, start) {
  const dist = new Map([[start, 0]]);
  const heap = new MinHeap([[0, start]]);   <KW>// [distance, node]</KW>

  while (heap.size) {
    const [d, node] = heap.pop();
    if (d > (dist.get(node) ?? Infinity)) continue;  <KW>// stale entry</KW>

    for (const [next, weight] of graph.get(node) ?? []) {
      const candidate = d + weight;
      if (candidate < (dist.get(next) ?? Infinity)) {
        dist.set(next, candidate);
        heap.push([candidate, next]);
      }
    }
  }
  return dist;
}

<KW>// Negative edges break it: a node settled as "done" might still</KW>
<KW>// get cheaper later. That's what Bellman-Ford is for.</KW>`,
    build: "Model a small metro map with travel times and find the fastest route between two stations. Then set every weight to 1 and check BFS gives the same answer.",
    check: "When does BFS stop being enough for shortest paths, and why do negative weights break Dijkstra?",
  },
  {
    num: "21",
    title: "Backtracking",
    time: "14 min",
    why: "Permutations, combinations, N-Queens, sudoku — all one template: choose, explore, un-choose. The un-choose step is what everyone forgets, and it produces bugs that look like the algorithm is haunted.",
    learn: [
      "The choose / explore / un-choose template",
      "Pruning: abandoning a branch the moment it can't work",
      "Why the un-choose step is mandatory when you share one array",
    ],
    code: `function permutations(nums) {
  const out = [];
  const current = [];
  const used = new Array(nums.length).fill(false);

  function backtrack() {
    if (current.length === nums.length) {
      out.push([...current]);        <KW>// copy — current keeps changing</KW>
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true; current.push(nums[i]);   <KW>// choose</KW>
      backtrack();                             <KW>// explore</KW>
      current.pop(); used[i] = false;          <KW>// un-choose</KW>
    }
  }

  backtrack();
  return out;
}
<KW>// Drop either un-choose line and the output is quietly, wildly wrong.</KW>`,
    build: "Generate all permutations, then delete the un-choose lines and look at what you get. Understanding that output is the lesson.",
    check: "What does the un-choose step actually undo, and why is `[...current]` necessary when pushing a result?",
  },
  {
    num: "22",
    title: "Dynamic programming",
    time: "14 min",
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
    num: "23",
    title: "Building the table",
    time: "14 min",
    why: "Memoisation is recursion that remembers. Tabulation is the same recurrence built bottom-up, with no call stack to overflow — and once it's a table, you can usually throw away all but the last row or two.",
    learn: [
      "Turning a memoised recursion into a bottom-up table",
      "Identifying which previous states a row actually needs",
      "Rolling arrays: O(n) space down to O(1)",
    ],
    code: `<KW>// Top-down, with a memo — recursion plus a cache.</KW>
function fibMemo(n, memo = new Map()) {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n);
  memo.set(n, fibMemo(n - 1, memo) + fibMemo(n - 2, memo));
  return memo.get(n);
}

<KW>// Bottom-up — same recurrence, no stack.</KW>
function fibTable(n) {
  const table = [0, 1];
  for (let i = 2; i <= n; i++) table[i] = table[i - 1] + table[i - 2];
  return table[n];
}

<KW>// Each row needs only the two before it, so keep only those:</KW>
function fibRolling(n) {
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
  return n <= 1 ? n : b;
}
<KW>// O(n) time, O(1) space.</KW>`,
    build: "Take the memoised solution to a climbing-stairs problem, rewrite it as a table, then reduce the table to two variables.",
    check: "What does tabulation give you that memoisation doesn't, and when can you drop the table to a couple of variables?",
  },
  {
    num: "24",
    title: "When greedy lies",
    time: "12 min",
    why: "Greedy is the fastest thing you can write and the easiest to be wrong with. It takes the locally best option every time, which is optimal for some problems and confidently incorrect for others — and the two look identical from the outside.",
    learn: [
      "The greedy-choice property, and what it actually requires",
      "Interval scheduling: a greedy that provably works",
      "Coin change: the same instinct, and a counter-example that kills it",
    ],
    code: `<KW>// Works: most non-overlapping meetings — always take the earliest finish.</KW>
function maxMeetings(intervals) {
  const sorted = [...intervals].sort((a, b) => a.end - b.end);
  let count = 0, lastEnd = -Infinity;
  for (const m of sorted) {
    if (m.start >= lastEnd) { count++; lastEnd = m.end; }
  }
  return count;
}

<KW>// Fails: fewest coins for 30, from [25, 10, 1].</KW>
<KW>// Greedy takes 25, then five 1s → six coins.</KW>
<KW>// The real answer is three 10s → three coins.</KW>
<KW>// Same instinct, wrong answer. Only DP is safe here.</KW>`,
    build: "Run the greedy coin change on 30 with coins [25, 10, 1] and watch it get it wrong. Then find a coin set where greedy is always right.",
    check: "Greedy works for interval scheduling and fails for coin change. What's the difference?",
  },
  {
    num: "25",
    title: "Pattern recognition & mock practice",
    time: "14 min",
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
