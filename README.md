# test_random
Testing PsychoJS randomisers

Disclaimer: yes, this is some ugly code. Once we get a nice unit testing pipeline set up, I'll refactor it

# Introduction
This script rips some classes from TrialHandler.js and Util.js in the PsychoJS repo in order to test its randomisers. 

# Overview of tests with long sequences
* [Testing the distribution of sequences generated via util.shuffle](https://github.com/tpronk/test_random/blob/b439ad4f1b4d5de042fb893bd3459565c74e7ee1/test_random.js#L210)
* [Testing whether a long sequence of a's and b's has the number of repetitions one would expect](https://github.com/tpronk/test_random/blob/b439ad4f1b4d5de042fb893bd3459565c74e7ee1/test_random.js#L233)
  * SEQUENTIAL. I expect no repetitions of length 2 or longer (i.e. a,b,a,b...)
  * RANDOM. Each pair of a and b are separately shuffled and then concatenated. I expect no repetitions of length 3 or longer (i.e. a,a,b,b,a,b is OK, but a,a,a,b,b,b is not)
  * FULL_RANDOM. All a's and b's are shuffled together. I expect a repetition of length 3 or longer (i.e. somewhere in the sequence a,a,a or b,b,b)

All these tests were passed.

# Overview of tests that align with e2e_conditions
In the experiment e2e_conditions, procedure random_funky, I noticed that a sequence shuffled via FULL_RANDOM did not have any repetitions of 3 or longer. Hence I added some tests that align with e2e_conditions.

e2e_conditions experiment:
* Gitlab: https://gitlab.pavlovia.org/tpronk/e2e_conditions
* Runner: https://run.pavlovia.org/tpronk/e2e_conditions/html/

[Tests aligned with e2e_conditions](https://github.com/tpronk/test_random/blob/b439ad4f1b4d5de042fb893bd3459565c74e7ee1/test_random.js#L265)
* e2e_conditions: random_csv. Passed. Both experiment and unit test yield: 4, 2, 3, 1
* e2e_conditions: random_xlsx. Passed. Both experiment and unit test yield: B, A, A, B
* e2e_conditions: random_funky. Failed. 
  * In the experiment I get: 2, 1, 1, 2, 1, 2
  * In the unit test I get: 2, 2, 2, 1, 1, 1

