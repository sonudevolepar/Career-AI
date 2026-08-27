import React, { useEffect, useState } from "react";

// ======================================================
// COMPLETE DSA CURRICULUM - 17 TOPICS
// ======================================================

const problems = {
  Arrays: {
    Easy: {
      title: "Two Sum",
      description:
        "Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target.",
      input: "nums = [2, 7, 11, 15], target = 9",
      output: "[0, 1]",
      explanation: "nums[0] + nums[1] = 2 + 7 = 9",
      funcName: "twoSum",
      args: "nums, target",
      hints: [
        "Start by checking every possible pair of numbers.",
        "The brute force approach takes O(n²) time.",
        "Try using a Hash Map to improve the solution.",
        "For every number, calculate target - current number.",
        "If the complement exists in the map, return both indices.",
      ],
    },

    Medium: {
      title: "Maximum Subarray",
      description: "Find the contiguous subarray with largest sum.",
      input: "[-2,1,-3,4,-1,2,1,-5,4]",
      output: "6",
      explanation: "Subarray [4,-1,2,1] has sum 6.",
      funcName: "maxSubArray",
      args: "nums",
      hints: [
        "Think about keeping a running sum.",
        "Use Kadane's Algorithm.",
        "At every position decide whether to start a new subarray.",
        "If the current sum becomes worse than the current number, restart.",
        "Keep track of the maximum sum found so far.",
      ],
    },

    Hard: {
      title: "First Missing Positive",
      description: "Find smallest missing positive integer.",
      input: "[3, 4, -1, 1]",
      output: "2",
      explanation: "2 is missing.",
      funcName: "firstMissingPositive",
      args: "nums",
      hints: [
        "Only positive numbers are important.",
        "The answer must be between 1 and n + 1.",
        "Try modifying the array in-place.",
        "Place number x at index x - 1.",
        "Find the first index where nums[i] is not i + 1.",
      ],
    },
  },

  Strings: {
    Easy: {
      title: "Valid Palindrome",
      description: "Check if string is palindrome.",
      input: '"racecar"',
      output: "true",
      explanation: "Reads the same forwards and backwards.",
      funcName: "isPalindrome",
      args: "s",
      hints: [
        "A palindrome reads the same from both directions.",
        "Use two pointers.",
        "One pointer starts from the left.",
        "Another pointer starts from the right.",
        "Move inward while comparing characters.",
      ],
    },

    Medium: {
      title: "Longest Substring Without Repeating Characters",
      description: "Find length of longest substring.",
      input: '"abcabcbb"',
      output: "3",
      explanation: '"abc" is the answer.',
      funcName: "lengthOfLongestSubstring",
      args: "s",
      hints: [
        "Think about a sliding window.",
        "Keep track of characters inside the current window.",
        "A Set can help detect duplicates.",
        "Move the left pointer when a duplicate appears.",
        "Keep the maximum window length.",
      ],
    },

    Hard: {
      title: "Minimum Window Substring",
      description: "Find minimum window containing characters.",
      input: 's="ADOBECODEBANC", t="ABC"',
      output: '"BANC"',
      explanation: "Contains A, B, and C.",
      funcName: "minWindow",
      args: "s, t",
      hints: [
        "Use two pointers.",
        "Create a frequency map for characters in t.",
        "Expand the right pointer to make the window valid.",
        "Once valid, move the left pointer to shrink it.",
        "Store the smallest valid window.",
      ],
    },
  },

  "Two Pointers": {
    Easy: {
      title: "Valid Palindrome II",
      description: "Check if palindrome after deleting one char.",
      input: '"abca"',
      output: "true",
      explanation: "Delete 'c'.",
      funcName: "validPalindrome",
      args: "s",
      hints: [
        "Use two pointers.",
        "Start one pointer from each end.",
        "When characters match, move both pointers.",
        "When they don't match, consider deleting one character.",
        "Check both possible deletions.",
      ],
    },

    Medium: {
      title: "Container With Most Water",
      description: "Find max area.",
      input: "[1,8,6,2,5,4,8,3,7]",
      output: "49",
      explanation: "Max area between index 1 and 8.",
      funcName: "maxArea",
      args: "height",
      hints: [
        "Area depends on width and the smaller height.",
        "Start pointers at both ends.",
        "Calculate the current area.",
        "Move the shorter line inward.",
        "Keep the maximum area.",
      ],
    },

    Hard: {
      title: "Trapping Rain Water",
      description: "Calculate trapped water.",
      input: "[0,1,0,2,1,0,1,3,2,1,2,1]",
      output: "6",
      explanation: "6 units trapped.",
      funcName: "trap",
      args: "height",
      hints: [
        "Water at a position depends on left and right maximum heights.",
        "Use two pointers.",
        "Maintain leftMax and rightMax.",
        "Process the side with the smaller maximum.",
        "Add the difference between maximum and current height.",
      ],
    },
  },

  "Sliding Window": {
    Easy: {
      title: "Maximum Average Subarray I",
      description: "Find max average of k elements.",
      input: "nums=[1,12,-5,-6,50,3], k=4",
      output: "12.5",
      explanation: "Maximum sum is 50.",
      funcName: "findMaxAverage",
      args: "nums, k",
      hints: [
        "The window always contains exactly k elements.",
        "Calculate the sum of the first k elements.",
        "Slide the window one position at a time.",
        "Remove the left element and add the new right element.",
        "Track the maximum sum and divide by k.",
      ],
    },

    Medium: {
      title: "Permutation in String",
      description: "Check if permutation exists.",
      input: 's1="ab", s2="eidbaooo"',
      output: "true",
      explanation: '"ba" is a permutation.',
      funcName: "checkInclusion",
      args: "s1, s2",
      hints: [
        "Use a fixed-size sliding window.",
        "The window size should equal s1.length.",
        "Track character frequencies.",
        "Compare window frequencies with s1.",
        "Return true when all frequencies match.",
      ],
    },

    Hard: {
      title: "Sliding Window Maximum",
      description: "Find max in each window.",
      input: "nums=[1,3,-1,-3,5,3,6,7], k=3",
      output: "[3,3,5,5,6,7]",
      explanation: "Maximum element from each window.",
      funcName: "maxSlidingWindow",
      args: "nums, k",
      hints: [
        "A normal window scan is too slow.",
        "Use a deque.",
        "Keep indexes whose values can become maximum.",
        "Maintain the deque in decreasing value order.",
        "The front of the deque is the maximum.",
      ],
    },
  },

  "Hash Tables": {
    Easy: {
      title: "Contains Duplicate",
      description: "Check if array has duplicates.",
      input: "[1,2,3,1]",
      output: "true",
      explanation: "1 appears twice.",
      funcName: "containsDuplicate",
      args: "nums",
      hints: [
        "You need to remember values already seen.",
        "A Hash Set is useful.",
        "Iterate through every number.",
        "If the number is already in the Set, return true.",
        "Otherwise insert it into the Set.",
      ],
    },

    Medium: {
      title: "Group Anagrams",
      description: "Group anagrams together.",
      input: '["eat","tea","tan","ate","nat","bat"]',
      output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
      explanation: "Words are grouped by their characters.",
      funcName: "groupAnagrams",
      args: "strs",
      hints: [
        "Anagrams contain the same characters.",
        "Sort every string.",
        "Use the sorted string as a key.",
        "Store words having the same key together.",
        "Return all groups.",
      ],
    },

    Hard: {
      title: "Substring with Concatenation of All Words",
      description: "Find starting indices of valid substrings.",
      input: 's="barfoothefoobarman", words=["foo","bar"]',
      output: "[0,9]",
      explanation: "Matches barfoo and foobar.",
      funcName: "findSubstring",
      args: "s, words",
      hints: [
        "All words have the same length.",
        "Create a frequency map for words.",
        "Use a sliding window.",
        "Track how many words are currently valid.",
        "Reset the window when an invalid word appears.",
      ],
    },
  },

  "Linked List": {
    Easy: {
      title: "Reverse Linked List",
      description: "Reverse a singly linked list.",
      input: "head = [1,2,3,4,5]",
      output: "[5,4,3,2,1]",
      explanation: "The links are reversed.",
      funcName: "reverseList",
      args: "head",
      hints: [
        "You need to change the direction of every next pointer.",
        "Keep a prev pointer.",
        "Keep a current pointer.",
        "Save current.next before changing it.",
        "Move prev and current forward.",
      ],
    },

    Medium: {
      title: "Remove Nth Node From End",
      description: "Remove nth node from the end.",
      input: "head=[1,2,3,4,5], n=2",
      output: "[1,2,3,5]",
      explanation: "Node 4 is removed.",
      funcName: "removeNthFromEnd",
      args: "head, n",
      hints: [
        "Use two pointers.",
        "Move the fast pointer n positions ahead.",
        "Then move both pointers together.",
        "The slow pointer will reach the node before the target.",
        "Remove the target node.",
      ],
    },

    Hard: {
      title: "Merge K Sorted Lists",
      description: "Merge k sorted linked lists.",
      input: "lists = [[1,4,5],[1,3,4],[2,6]]",
      output: "[1,1,2,3,4,4,5,6]",
      explanation: "All lists are merged.",
      funcName: "mergeKLists",
      args: "lists",
      hints: [
        "Each individual list is already sorted.",
        "You can repeatedly find the smallest node.",
        "A Min Heap can make finding the smallest node efficient.",
        "Put the first node of every list into the heap.",
        "After removing a node, insert its next node.",
      ],
    },
  },

  Stack: {
    Easy: {
      title: "Valid Parentheses",
      description: "Check if brackets are valid.",
      input: '"()[]{}"',
      output: "true",
      explanation: "All brackets close correctly.",
      funcName: "isValid",
      args: "s",
      hints: [
        "Opening brackets need matching closing brackets.",
        "Use a stack.",
        "Push every opening bracket.",
        "When a closing bracket appears, compare with stack top.",
        "The stack must be empty at the end.",
      ],
    },

    Medium: {
      title: "Evaluate Reverse Polish Notation",
      description: "Evaluate an RPN expression.",
      input: '["2","1","+","3","*"]',
      output: "9",
      explanation: "(2+1)*3=9.",
      funcName: "evalRPN",
      args: "tokens",
      hints: [
        "Use a stack.",
        "Push numbers onto the stack.",
        "When an operator appears, pop two numbers.",
        "Apply the operator in the correct order.",
        "Push the result back onto the stack.",
      ],
    },

    Hard: {
      title: "Largest Rectangle in Histogram",
      description: "Find largest rectangle area.",
      input: "[2,1,5,6,2,3]",
      output: "10",
      explanation: "Maximum rectangle area is 10.",
      funcName: "largestRectangleArea",
      args: "heights",
      hints: [
        "For every bar, find how far it can extend.",
        "A smaller height limits the rectangle.",
        "Use a monotonic stack.",
        "Store indexes of increasing heights.",
        "Calculate area when a smaller bar appears.",
      ],
    },
  },

  Queue: {
    Easy: {
      title: "Implement Queue Using Stack",
      description: "Implement FIFO queue using two stacks.",
      input: '["push","push","peek"]',
      output: "[1,2,1]",
      explanation: "Queue follows FIFO.",
      funcName: "MyQueue",
      args: "",
      hints: [
        "A queue follows First In First Out.",
        "A stack follows Last In First Out.",
        "Use two stacks to reverse the order.",
        "Use one stack for input and another for output.",
        "Move elements to the output stack when needed.",
      ],
    },

    Medium: {
      title: "Circular Queue",
      description: "Design a circular queue.",
      input: "capacity = 3",
      output: "true",
      explanation: "Empty positions are reused.",
      funcName: "MyCircularQueue",
      args: "k",
      hints: [
        "Use an array of fixed capacity.",
        "Keep track of the front.",
        "Keep track of the rear.",
        "Track the current size.",
        "Use modulo to wrap indexes around.",
      ],
    },

    Hard: {
      title: "Design Circular Deque",
      description: "Design a double-ended circular queue.",
      input: "capacity = 3",
      output: "true",
      explanation: "Insertion and deletion work from both ends.",
      funcName: "MyCircularDeque",
      args: "k",
      hints: [
        "Deque supports operations at both ends.",
        "Use a circular array.",
        "Track front and rear positions.",
        "Track the current number of elements.",
        "Use modulo arithmetic for wrap-around.",
      ],
    },
  },

  "Binary Search": {
    Easy: {
      title: "Binary Search",
      description: "Find target index in sorted array.",
      input: "nums=[-1,0,3,5,9,12], target=9",
      output: "4",
      explanation: "Target is at index 4.",
      funcName: "search",
      args: "nums, target",
      hints: [
        "The array is sorted.",
        "Use left and right pointers.",
        "Calculate the middle index.",
        "Discard half of the search space.",
        "Continue until the target is found.",
      ],
    },

    Medium: {
      title: "Search in Rotated Sorted Array",
      description: "Find target in rotated sorted array.",
      input: "nums=[4,5,6,7,0,1,2], target=0",
      output: "4",
      explanation: "Target is at index 4.",
      funcName: "search",
      args: "nums, target",
      hints: [
        "One half of the array is always sorted.",
        "Find the middle element.",
        "Determine which half is sorted.",
        "Check whether target belongs to that half.",
        "Discard the other half.",
      ],
    },

    Hard: {
      title: "Median of Two Sorted Arrays",
      description: "Find median of two sorted arrays.",
      input: "nums1=[1,3], nums2=[2]",
      output: "2.0",
      explanation: "Median is 2.",
      funcName: "findMedianSortedArrays",
      args: "nums1, nums2",
      hints: [
        "The arrays are sorted.",
        "Try partitioning the arrays.",
        "Binary search on the smaller array.",
        "Make sure left values are smaller than right values.",
        "Calculate the median from the partition.",
      ],
    },
  },

  Trees: {
    Easy: {
      title: "Invert Binary Tree",
      description: "Invert a binary tree.",
      input: "root=[4,2,7,1,3,6,9]",
      output: "[4,7,2,9,6,3,1]",
      explanation: "Left and right children are swapped.",
      funcName: "invertTree",
      args: "root",
      hints: [
        "Every node has left and right children.",
        "Swap the children of each node.",
        "Recursion can solve this naturally.",
        "Process the left subtree.",
        "Process the right subtree.",
      ],
    },

    Medium: {
      title: "Lowest Common Ancestor",
      description: "Find LCA of two nodes.",
      input: "root=[3,5,1,6,2,0,8], p=5, q=1",
      output: "3",
      explanation: "The LCA is node 3.",
      funcName: "lowestCommonAncestor",
      args: "root, p, q",
      hints: [
        "Start from the root.",
        "If root is p or q, it may be the answer.",
        "Search the left subtree.",
        "Search the right subtree.",
        "If both sides find a node, root is the LCA.",
      ],
    },

    Hard: {
      title: "Binary Tree Maximum Path Sum",
      description: "Find maximum path sum.",
      input: "root=[-10,9,20,null,null,15,7]",
      output: "42",
      explanation: "15 -> 20 -> 7 gives 42.",
      funcName: "maxPathSum",
      args: "root",
      hints: [
        "A path can pass through a node.",
        "Use post-order traversal.",
        "Calculate the best contribution from each child.",
        "Ignore negative contributions.",
        "Update a global maximum at every node.",
      ],
    },
  },

  Graphs: {
    Easy: {
      title: "Flood Fill",
      description: "Fill connected pixels with a new color.",
      input:
        "image=[[1,1,1],[1,1,0],[1,0,1]], sr=1, sc=1, color=2",
      output: "[[2,2,2],[2,2,0],[2,0,1]]",
      explanation: "Connected pixels are changed.",
      funcName: "floodFill",
      args: "image, sr, sc, color",
      hints: [
        "Treat every pixel as a graph node.",
        "A pixel has up to four neighbors.",
        "Use DFS or BFS.",
        "Only visit pixels having the original color.",
        "Change the color when visiting.",
      ],
    },

    Medium: {
      title: "Number of Islands",
      description: "Count connected islands.",
      input: "grid=[['1','1','0'],['0','0','1']]",
      output: "2",
      explanation: "There are 2 separate islands.",
      funcName: "numIslands",
      args: "grid",
      hints: [
        "Scan every cell.",
        "When you find land, start a traversal.",
        "Use DFS or BFS.",
        "Mark visited land so it is not counted again.",
        "Each new traversal represents one island.",
      ],
    },

    Hard: {
      title: "Word Ladder",
      description: "Find shortest transformation sequence.",
      input: 'beginWord="hit", endWord="cog"',
      output: "5",
      explanation: "hit -> hot -> dot -> dog -> cog.",
      funcName: "ladderLength",
      args: "beginWord, endWord, wordList",
      hints: [
        "This is a shortest path problem.",
        "Use BFS.",
        "Each word is a graph node.",
        "Connect words differing by one character.",
        "The first time you reach the target gives the shortest path.",
      ],
    },
  },

  "Heaps (Priority Queue)": {
    Easy: {
      title: "Kth Largest Element in a Stream",
      description: "Find kth largest element.",
      input: "k=3, nums=[4,5,8,2]",
      output: "4",
      explanation: "4 is the 3rd largest.",
      funcName: "add",
      args: "val",
      hints: [
        "You need to keep track of the largest k values.",
        "A Min Heap is useful.",
        "Keep heap size equal to k.",
        "If heap becomes larger than k, remove the smallest.",
        "The heap top becomes the kth largest.",
      ],
    },

    Medium: {
      title: "Top K Frequent Elements",
      description: "Return k most frequent elements.",
      input: "nums=[1,1,1,2,2,3], k=2",
      output: "[1,2]",
      explanation: "1 and 2 are the most frequent.",
      funcName: "topKFrequent",
      args: "nums, k",
      hints: [
        "First count the frequency of each number.",
        "Use a Hash Map.",
        "Then find the k highest frequencies.",
        "A heap can efficiently maintain the top k.",
        "Return the numbers stored in the heap.",
      ],
    },

    Hard: {
      title: "Find Median from Data Stream",
      description: "Get median at any time.",
      input: "addNum(1), findMedian()",
      output: "1.0",
      explanation: "Median is 1.0.",
      funcName: "findMedian",
      args: "",
      hints: [
        "Split numbers into lower and upper halves.",
        "Use two heaps.",
        "Use a Max Heap for the lower half.",
        "Use a Min Heap for the upper half.",
        "Keep both heaps balanced.",
      ],
    },
  },

  "Dynamic Programming": {
    Easy: {
      title: "Climbing Stairs",
      description: "Count ways to climb n stairs.",
      input: "n=3",
      output: "3",
      explanation: "There are 3 possible ways.",
      funcName: "climbStairs",
      args: "n",
      hints: [
        "To reach stair n, come from n-1 or n-2.",
        "This creates a recurrence relation.",
        "Use dp[i] to store the number of ways.",
        "dp[i] = dp[i-1] + dp[i-2].",
        "You can optimize the space to two variables.",
      ],
    },

    Medium: {
      title: "Coin Change",
      description: "Find fewest coins to make amount.",
      input: "coins=[1,2,5], amount=11",
      output: "3",
      explanation: "11 = 5 + 5 + 1.",
      funcName: "coinChange",
      args: "coins, amount",
      hints: [
        "Use Dynamic Programming.",
        "dp[i] represents minimum coins for amount i.",
        "Try every coin for every amount.",
        "Use dp[i-coin] + 1.",
        "Take the minimum result.",
      ],
    },

    Hard: {
      title: "Edit Distance",
      description: "Find minimum operations to convert word1 to word2.",
      input: 'word1="horse", word2="ros"',
      output: "3",
      explanation: "Three operations are required.",
      funcName: "minDistance",
      args: "word1, word2",
      hints: [
        "Use a 2D DP table.",
        "Compare characters at current positions.",
        "If characters match, no new operation is needed.",
        "Otherwise consider insert, delete, and replace.",
        "Take the minimum of the three operations.",
      ],
    },
  },

  "Greedy Algorithms": {
    Easy: {
      title: "Assign Cookies",
      description: "Maximize number of happy children.",
      input: "g=[1,2,3], s=[1,1]",
      output: "1",
      explanation: "Only one child can receive a suitable cookie.",
      funcName: "findContentChildren",
      args: "g, s",
      hints: [
        "Sort both arrays.",
        "Start from the smallest child.",
        "Try to give the smallest suitable cookie.",
        "Use two pointers.",
        "Count successfully satisfied children.",
      ],
    },

    Medium: {
      title: "Jump Game",
      description: "Can you reach the last index?",
      input: "nums=[2,3,1,1,4]",
      output: "true",
      explanation: "The last index is reachable.",
      funcName: "canJump",
      args: "nums",
      hints: [
        "You don't need to try every possible jump.",
        "Track the furthest index reachable.",
        "Update the furthest position at every index.",
        "If the current index is beyond the reachable range, return false.",
        "If the last index becomes reachable, return true.",
      ],
    },

    Hard: {
      title: "Minimum Number of Taps",
      description: "Find minimum taps to cover garden.",
      input: "n=5, ranges=[3,4,1,1,0,0]",
      output: "1",
      explanation: "Tap 0 covers the complete garden.",
      funcName: "minTaps",
      args: "n, ranges",
      hints: [
        "Convert every tap into an interval.",
        "Each interval covers a range of positions.",
        "This becomes similar to Jump Game.",
        "Greedily choose the interval extending farthest.",
        "Count the number of intervals used.",
      ],
    },
  },

  Backtracking: {
    Easy: {
      title: "Binary Watch",
      description: "Return all possible times.",
      input: "turnedOn=1",
      output: '["0:01","0:02","0:04","0:08","0:16"]',
      explanation: "Exactly one LED is turned on.",
      funcName: "readBinaryWatch",
      args: "turnedOn",
      hints: [
        "A binary watch contains hour and minute LEDs.",
        "Generate possible combinations.",
        "Count the number of set bits.",
        "Check whether the hour and minute are valid.",
        "Return all valid times.",
      ],
    },

    Medium: {
      title: "Permutations",
      description: "Return all possible permutations.",
      input: "nums=[1,2,3]",
      output: "[[1,2,3],[1,3,2],...]",
      explanation: "All possible permutations are generated.",
      funcName: "permute",
      args: "nums",
      hints: [
        "Build the permutation one element at a time.",
        "Use recursion.",
        "Track which elements are already used.",
        "Backtrack after exploring a choice.",
        "Continue until the permutation contains all elements.",
      ],
    },

    Hard: {
      title: "N-Queens",
      description: "Place n queens on an n x n board.",
      input: "n=4",
      output: "[[...]]",
      explanation: "Generate all valid queen arrangements.",
      funcName: "solveNQueens",
      args: "n",
      hints: [
        "Place one queen per row.",
        "Track occupied columns.",
        "Track both diagonals.",
        "Backtrack when a position is invalid.",
        "Continue until all rows contain queens.",
      ],
    },
  },

  "Sorting & Searching": {
    Easy: {
      title: "Merge Sorted Array",
      description: "Merge nums2 into nums1.",
      input: "nums1=[1,2,3,0,0,0], nums2=[2,5,6]",
      output: "[1,2,2,3,5,6]",
      explanation: "The arrays are merged in-place.",
      funcName: "merge",
      args: "nums1, m, nums2, n",
      hints: [
        "Both arrays are sorted.",
        "Use three pointers.",
        "Start from the end of both valid portions.",
        "Put the larger element at the end.",
        "Move pointers backward.",
      ],
    },

    Medium: {
      title: "Sort Colors",
      description: "Sort 0s, 1s, and 2s.",
      input: "nums=[2,0,2,1,1,0]",
      output: "[0,0,1,1,2,2]",
      explanation: "Array is sorted in-place.",
      funcName: "sortColors",
      args: "nums",
      hints: [
        "There are only three possible values.",
        "Use the Dutch National Flag algorithm.",
        "Keep low, mid, and high pointers.",
        "Move 0s to the left.",
        "Move 2s to the right.",
      ],
    },

    Hard: {
      title: "Count Smaller Numbers After Self",
      description: "Count smaller elements to the right.",
      input: "nums=[5,2,6,1]",
      output: "[2,1,1,0]",
      explanation: "Each position contains its count.",
      funcName: "countSmaller",
      args: "nums",
      hints: [
        "Brute force takes O(n²).",
        "Try using Merge Sort.",
        "During merging, count elements that move ahead.",
        "Maintain original indexes.",
        "Store the count for each original index.",
      ],
    },
  },

  "Recursion": {
    Easy: {
      title: "Fibonacci Number",
      description: "Calculate the nth Fibonacci number.",
      input: "n = 5",
      output: "5",
      explanation: "Fibonacci sequence: 0,1,1,2,3,5.",
      funcName: "fib",
      args: "n",
      hints: [
        "Fibonacci is defined using previous two values.",
        "The base cases are n=0 and n=1.",
        "For other values use fib(n-1) + fib(n-2).",
        "This is a classic recursion problem.",
        "Memoization can improve the time complexity.",
      ],
    },

    Medium: {
      title: "Power of Number",
      description: "Calculate x raised to the power n.",
      input: "x = 2, n = 10",
      output: "1024",
      explanation: "2^10 = 1024.",
      funcName: "myPow",
      args: "x, n",
      hints: [
        "Think recursively about the exponent.",
        "x^n can be divided into smaller powers.",
        "For even n, use x^(n/2) twice.",
        "For odd n, multiply one extra x.",
        "This can reduce the complexity to O(log n).",
      ],
    },

    Hard: {
      title: "Generate Parentheses",
      description: "Generate all valid combinations of n pairs of parentheses.",
      input: "n = 3",
      output: '["((()))","(()())","(())()","()(())","()()()"]',
      explanation: "All generated combinations are valid.",
      funcName: "generateParenthesis",
      args: "n",
      hints: [
        "Use backtracking.",
        "Track the number of open parentheses.",
        "Track the number of close parentheses.",
        "You can add ')' only when close < open.",
        "Stop when the string length becomes 2*n.",
      ],
    },
  },
};

// ======================================================
// TOPICS
// ======================================================

const topics = Object.keys(problems);

// ======================================================
// DSA COACH COMPONENT
// ======================================================

const DSACoach = () => {
  const [topic, setTopic] = useState("Arrays");
  const [difficulty, setDifficulty] = useState("Easy");
  const [language, setLanguage] = useState("JavaScript");

  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);

  const [hintLevel, setHintLevel] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const [problemsSolved, setProblemsSolved] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const currentProblem = problems[topic][difficulty];

  // ====================================================
  // STARTER CODE
  // ====================================================

  const getStarterCode = (prob, lang) => {
    if (lang === "Java") {
      if (prob.funcName === "twoSum") {
        return `import java.util.*;

public class Main {

    public static int[] twoSum(int[] nums, int target) {

        HashMap<Integer, Integer> map = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {

            int complement = target - nums[i];

            if (map.containsKey(complement)) {
                return new int[] {
                    map.get(complement),
                    i
                };
            }

            map.put(nums[i], i);
        }

        return new int[] {};
    }

    public static void main(String[] args) {

        int[] nums = {2, 7, 11, 15};
        int target = 9;

        int[] result = twoSum(nums, target);

        System.out.println(Arrays.toString(result));
    }
}`;

      }

      return `public class Main {

    public static void main(String[] args) {

        // Write your Java solution here

        System.out.println("Hello from Career AI DSA Coach");

    }
}`;
    }

    if (lang === "Python") {
      return `def ${prob.funcName}(${prob.args}):
    # Write your Python solution here
    pass


# Test your solution here
print("Run your solution")`;
    }

    if (lang === "C++") {
      return `#include <iostream>
#include <vector>
#include <unordered_map>
#include <algorithm>

using namespace std;

int main() {

    // Write your C++ solution here

    return 0;
}`;
    }

    return `function ${prob.funcName}(${prob.args}) {

  // Write your JavaScript solution here

}

// Test your solution here
console.log("Run your solution");`;
  };

  // ====================================================
  // RESET PROBLEM
  // ====================================================

  const resetProblemState = (
    newTopic = topic,
    newDifficulty = difficulty,
    newLanguage = language
  ) => {
    const prob = problems[newTopic][newDifficulty];

    setCode(getStarterCode(prob, newLanguage));
    setResult(null);

    // IMPORTANT:
    // Every new problem starts with 0 hints
    setHintLevel(0);
    setShowHint(false);

    setTime(0);
    setIsTimerRunning(true);
  };

  // ====================================================
  // LANGUAGE CHANGE
  // ====================================================

  useEffect(() => {
    resetProblemState(topic, difficulty, language);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // ====================================================
  // TIMER
  // ====================================================

  useEffect(() => {
    let interval;

    if (isTimerRunning) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // ====================================================
  // FORMAT TIME
  // ====================================================

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");

    const secondsPart = (seconds % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${secondsPart}`;
  };

  // ====================================================
  // TOPIC CHANGE
  // ====================================================

  const handleTopicChange = (newTopic) => {
    setTopic(newTopic);
    setDifficulty("Easy");

    resetProblemState(
      newTopic,
      "Easy",
      language
    );
  };

  // ====================================================
  // DIFFICULTY CHANGE
  // ====================================================

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);

    resetProblemState(
      topic,
      newDifficulty,
      language
    );
  };

  // ====================================================
  // RESET CODE
  // ====================================================

  const handleResetCode = () => {
    setCode(
      getStarterCode(
        currentProblem,
        language
      )
    );

    setResult({
      type: "info",
      message: "Code reset to default template.",
    });
  };

  // ====================================================
  // RUN CODE
  // ====================================================

  const handleRunCode = async () => {
    if (!code.trim()) {
      setResult({
        type: "error",
        message:
          "Please write some code before running.",
      });

      return;
    }

    setIsRunning(true);

    setResult({
      type: "info",
      message:
        `Running ${language} code...`,
    });

    try {
      console.log(
        "Sending code to backend..."
      );

      const response = await fetch(
        "http://localhost:5000/api/dsa/run",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            code: code,
            language: language,
          }),
        }
      );

      console.log(
        "Backend status:",
        response.status
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Backend returned an invalid response."
        );
      }

      console.log(
        "Backend response:",
        data
      );

      if (!response.ok || !data.success) {
        setResult({
          type: "error",
          message:
            data.output ||
            data.message ||
            "Code execution failed.",
        });

        return;
      }

      setResult({
        type: "success",
        message:
          `Output: ${
            data.output ||
            "Program executed successfully with no output."
          }`,
      });

    } catch (error) {
      console.error(
        "Run Code Error:",
        error
      );

      setResult({
        type: "error",
        message:
          "Backend connection failed. Make sure backend is running on http://localhost:5000",
      });

    } finally {
      setIsRunning(false);
    }
  };

  // ====================================================
  // SUBMIT
  // ====================================================

  const handleSubmit = () => {
    if (!code.trim()) {
      setResult({
        type: "error",
        message:
          "Please write some code before submitting.",
      });

      return;
    }

    setIsTimerRunning(false);

    setProblemsSolved(
      (prev) => prev + 1
    );

    setResult({
      type: "success",
      message:
        `Code submitted successfully! Solved in ${formatTime(
          time
        )}.`,
    });
  };

  // ====================================================
  // HINT SYSTEM - EXACTLY 5 HITS
  // ====================================================

  const handleHint = () => {
    const maxHints =
      currentProblem.hints.length;

    if (hintLevel < maxHints) {
      const nextLevel =
        hintLevel + 1;

      setHintLevel(nextLevel);
      setShowHint(true);

      console.log(
        `Hint ${nextLevel}/${maxHints} revealed`
      );
    }
  };

  // ====================================================
  // NEXT PROBLEM
  // ====================================================

  const handleNextProblem = () => {
    const difficultyOrder = [
      "Easy",
      "Medium",
      "Hard",
    ];

    const currentIndex =
      difficultyOrder.indexOf(
        difficulty
      );

    if (
      currentIndex <
      difficultyOrder.length - 1
    ) {
      handleDifficultyChange(
        difficultyOrder[
          currentIndex + 1
        ]
      );
    } else {
      handleDifficultyChange("Easy");
    }
  };

  // ====================================================
  // TAB INDENTATION
  // ====================================================

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();

      const start =
        e.target.selectionStart;

      const end =
        e.target.selectionEnd;

      const newCode =
        code.substring(0, start) +
        "  " +
        code.substring(end);

      setCode(newCode);

      setTimeout(() => {
        e.target.selectionStart =
          e.target.selectionEnd =
            start + 2;
      }, 0);
    }
  };

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">

          <div>
            <h1 className="text-3xl font-bold text-blue-600 md:text-4xl">
              🤖 DSA Coach
            </h1>

            <p className="mt-2 text-slate-600">
              Your AI-powered personal DSA learning coach
            </p>

            <p className="mt-1 text-sm font-semibold text-blue-500">
              {topics.length} DSA Topics Available
            </p>
          </div>

          <div className="rounded-xl bg-white px-5 py-3 shadow-sm border border-slate-200 w-fit">

            <p className="text-sm font-semibold text-slate-500">
              Time Elapsed
            </p>

            <p
              className={`text-2xl font-mono font-bold ${
                isTimerRunning
                  ? "text-blue-600"
                  : "text-green-600"
              }`}
            >
              ⏱️ {formatTime(time)}
            </p>

          </div>
        </div>

        {/* SELECTION PANEL */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm border border-slate-100">

          <div className="grid gap-5 md:grid-cols-3">

            {/* TOPIC */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                DSA Topic
              </label>

              <select
                value={topic}
                onChange={(e) =>
                  handleTopicChange(
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 font-medium bg-white"
              >
                {topics.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>

            </div>

            {/* DIFFICULTY */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Difficulty
              </label>

              <select
                value={difficulty}
                onChange={(e) =>
                  handleDifficultyChange(
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 font-medium bg-white"
              >
                <option value="Easy">
                  🟢 Easy
                </option>

                <option value="Medium">
                  🟡 Medium
                </option>

                <option value="Hard">
                  🔴 Hard
                </option>
              </select>

            </div>

            {/* LANGUAGE */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Language
              </label>

              <select
                value={language}
                onChange={(e) =>
                  setLanguage(
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 font-medium bg-white"
              >
                <option value="Java">
                  Java
                </option>

                <option value="JavaScript">
                  JavaScript
                </option>

                <option value="Python">
                  Python
                </option>

                <option value="C++">
                  C++
                </option>
              </select>

            </div>

          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* PROBLEM PANEL */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex flex-col">

            <div className="mb-5 flex items-start justify-between gap-4">

              <div>

                <p className="mb-2 text-sm font-bold text-blue-600 uppercase tracking-wider">
                  {topic}
                </p>

                <h2 className="text-2xl font-bold text-slate-900">
                  {currentProblem.title}
                </h2>

              </div>

              <span
                className={`rounded-full px-4 py-1.5 text-sm font-bold whitespace-nowrap ${
                  difficulty === "Easy"
                    ? "bg-green-100 text-green-700"
                    : difficulty === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {difficulty}
              </span>

            </div>

            <p className="leading-7 text-slate-700 text-lg border-l-4 border-blue-200 pl-4 bg-slate-50 p-3 rounded-r-lg">
              {currentProblem.description}
            </p>

            {/* EXAMPLE */}
            <div className="mt-6 rounded-xl bg-slate-900 p-5 text-sm text-white font-mono shadow-inner overflow-x-auto">

              <p className="mb-3 font-semibold text-slate-400 uppercase tracking-widest text-xs">
                Example
              </p>

              <p>
                <span className="text-blue-400 font-bold">
                  Input:
                </span>{" "}
                {currentProblem.input}
              </p>

              <p className="mt-2">
                <span className="text-green-400 font-bold">
                  Output:
                </span>{" "}
                {currentProblem.output}
              </p>

              <p className="mt-3 text-slate-400 italic border-t border-slate-700 pt-2 text-xs">
                Explanation:{" "}
                {currentProblem.explanation}
              </p>

            </div>

            {/* AI COACH */}
            <div className="mt-auto pt-6">

              <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5">

                <div className="flex items-center justify-between gap-4">

                  <div>

                    <h3 className="font-bold text-blue-900 flex items-center gap-2">
                      🤖 AI Coach
                    </h3>

                    <p className="text-xs text-blue-700 mt-1">

                      {hintLevel <
                      currentProblem.hints.length
                        ? `Stuck? Take a hint (${hintLevel}/${currentProblem.hints.length})`
                        : "All 5 hints revealed!"}

                    </p>

                  </div>

                  <button
                    onClick={handleHint}
                    disabled={
                      hintLevel >=
                      currentProblem.hints.length
                    }
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm whitespace-nowrap"
                  >
                    💡{" "}
                    {hintLevel >=
                    currentProblem.hints.length
                      ? "All Hints"
                      : "Get Hint"}
                  </button>

                </div>

                {/* HINTS */}
                {showHint && (
                  <div className="mt-4 flex flex-col gap-2">

                    {currentProblem.hints
                      .slice(0, hintLevel)
                      .map(
                        (
                          hint,
                          index
                        ) => (
                          <div
                            key={index}
                            className="rounded-lg bg-white p-3 text-sm text-slate-700 shadow-sm border border-slate-100 flex gap-3 items-start"
                          >

                            <span className="bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded text-xs">
                              {index + 1}
                            </span>

                            <p className="mt-0.5 font-medium">
                              {hint}
                            </p>

                          </div>
                        )
                      )}

                  </div>
                )}

              </div>

            </div>
          </div>

          {/* CODE EDITOR */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex flex-col">

            <div className="mb-4 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  💻 Editor
                </h2>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  {language} Workspace
                </p>

              </div>

              <button
                onClick={handleResetCode}
                disabled={isRunning}
                className="text-sm font-semibold text-slate-500 hover:text-red-500 transition px-3 py-1 bg-slate-100 rounded-lg hover:bg-red-50 disabled:opacity-50"
              >
                🔄 Reset Code
              </button>

            </div>

            {/* EDITOR */}
            <div className="overflow-hidden rounded-xl bg-slate-950 flex-grow shadow-inner">

              <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-3 bg-slate-900">

                <span className="h-3 w-3 rounded-full bg-red-500"></span>

                <span className="h-3 w-3 rounded-full bg-yellow-500"></span>

                <span className="h-3 w-3 rounded-full bg-green-500"></span>

                <span className="ml-3 text-xs font-mono text-slate-400">

                  {language === "Java"
                    ? "Main.java"
                    : language === "Python"
                    ? "main.py"
                    : language === "JavaScript"
                    ? "main.js"
                    : "main.cpp"}

                </span>

              </div>

              <textarea
                value={code}
                onChange={(e) =>
                  setCode(e.target.value)
                }
                onKeyDown={handleKeyDown}
                spellCheck="false"
                disabled={isRunning}
                className="h-[380px] w-full resize-none bg-slate-950 p-5 font-mono text-[15px] leading-relaxed text-green-400 outline-none focus:ring-1 focus:ring-slate-700 disabled:opacity-70"
              />

            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-5 flex flex-wrap gap-3">

              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex-1 rounded-xl bg-slate-800 px-5 py-3 font-semibold text-white transition hover:bg-slate-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning
                  ? "⏳ Running..."
                  : "▶ Run Code"}
              </button>

              <button
                onClick={handleSubmit}
                disabled={isRunning}
                className="flex-1 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 shadow-md shadow-blue-200 disabled:opacity-50"
              >
                🚀 Submit
              </button>

              <button
                onClick={handleNextProblem}
                disabled={isRunning}
                className="w-full md:w-auto rounded-xl border-2 border-slate-200 px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50"
              >
                Next Problem ➔
              </button>

            </div>

            {/* RESULT */}
            {result && (
              <div
                className={`mt-5 rounded-xl p-4 text-sm font-medium border ${
                  result.type === "success"
                    ? "bg-green-50 text-green-800 border-green-200"
                    : result.type === "error"
                    ? "bg-red-50 text-red-800 border-red-200"
                    : "bg-blue-50 text-blue-800 border-blue-200"
                }`}
              >

                <div className="flex gap-3 items-start">

                  <span className="text-xl">

                    {result.type === "success"
                      ? "✅"
                      : result.type === "error"
                      ? "❌"
                      : "ℹ️"}

                  </span>

                  <pre className="whitespace-pre-wrap break-words font-sans">
                    {result.message}
                  </pre>

                </div>

              </div>
            )}

          </div>
        </div>

        {/* PROGRESS */}
        <div className="mt-6 grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 shadow-md text-white">

            <p className="text-sm font-medium text-blue-100">
              Problems Solved
            </p>

            <p className="mt-2 text-4xl font-black">
              {problemsSolved}
            </p>

            <p className="mt-1 text-sm font-medium text-blue-100">
              Keep crushing it! 🔥
            </p>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">

            <p className="text-sm font-semibold text-slate-500">
              Current Target
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {topic}
            </p>

            <p className="mt-1 text-sm font-medium text-slate-500">
              {difficulty} Level
            </p>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">

            <p className="text-sm font-semibold text-slate-500">
              AI Coach Status
            </p>

            <p className="mt-2 text-2xl font-bold text-green-500 flex items-center gap-2">

              <span className="relative flex h-3 w-3">

                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>

                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>

              </span>

              Monitoring

            </p>

            <p className="mt-1 text-sm font-medium text-slate-500">
              5 hints available per problem
            </p>

          </div>

        </div>

      </div>
    </div>
  );
};

export default DSACoach;