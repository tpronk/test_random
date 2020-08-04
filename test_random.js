Math.seedrandom = require('seedrandom');

// *** CODE RIPPED FROM util.js
const util = {
  /**
   * Shuffle an array in place using the Fisher-Yastes's modern algorithm
   * <p>See details here: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm</p>
   *
   * @name module:util.shuffle
   * @function
   * @public
   * @param {Object[]} array - the input 1-D array
   * @return {Object[]} the shuffled array
   */
  shuffle: function (array)
  {
    for (let i = array.length - 1; i > 0; i--)
    {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
};
  

// *** CODE RIPPED FROM TrialHandler.js
class TrialHandler {
	/*
	 * Prepare the sequence of trials.
	 *
	 * <p>The returned sequence is a matrix (an array of arrays) of trial indices
	 * with nStim columns and nReps rows. Note that this is the transpose of the
	 * matrix return by PsychoPY.
	 * 
	 * Example: with 3 trial and 5 repetitions, we get:
	 *   - sequential:
	 *      [[0 1 2]
	 *       [0 1 2]
	 *       [0 1 2]
	 *       [0 1 2]
	 *       [0 1 2]]
	 *
	 * These 3*5 = 15 trials will be returned by the TrialHandler generator
	 * - with method = 'sequential' in the order:
	 *    0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2
	 * - with method = 'random' in the order (amongst others):
	 *    2, 1, 0, 0, 2, 1, 0, 1, 2, 0, 1, 2, 1, 2, 0
	 * - with method = 'fullRandom' in the order (amongst others):
	 *    2, 0, 0, 1, 0, 2, 1, 2, 0, 1, 1, 1, 2, 0, 2
	 * </p>
	 *
	 * @protected
	 */
	_prepareSequence()
	{
		const response = {
			origin: 'TrialHandler._prepareSequence',
			context: 'when preparing a sequence of trials'
		};

		// get an array of the indices of the elements of trialList :
		const indices = Array.from(this.trialList.keys());

		// seed the random number generator:
		if (typeof (this.seed) !== 'undefined')
		{
			Math.seedrandom(this.seed);
		}
		else
		{
			Math.seedrandom();
		}

		if (this.method === TrialHandler.Method.SEQUENTIAL)
		{
			this._trialSequence = Array(this.nReps).fill(indices);
			// transposed version:
			//this._trialSequence = indices.reduce( (seq, e) => { seq.push( Array(this.nReps).fill(e) ); return seq; }, [] );
		}

		else if (this.method === TrialHandler.Method.RANDOM)
		{
			this._trialSequence = [];
			for (let i = 0; i < this.nReps; ++i)
			{
				this._trialSequence.push(util.shuffle(indices.slice()));
			}
		}

		else if (this.method === TrialHandler.Method.FULL_RANDOM)
		{
			// create a flat sequence with nReps repeats of indices:
			let flatSequence = [];
			for (let i = 0; i < this.nReps; ++i)
			{
				flatSequence.push.apply(flatSequence, indices);
			}

			// shuffle the sequence:
			util.shuffle(flatSequence);

			// reshape it into the trialSequence:
			this._trialSequence = [];
			for (let i = 0; i < this.nReps; i++)
			{
				this._trialSequence.push(flatSequence.slice(i * this.nStim, (i + 1) * this.nStim));
			}
		}
		else
		{
			throw Object.assign(response, {error: 'unknown method'});
		}

		return this._trialSequence;
	}

}

/**
 * TrialHandler method
 *
 * @enum {Symbol}
 * @readonly
 * @public
 */
TrialHandler.Method = {
	/**
	 * Conditions are presented in the order they are given.
	 */
	SEQUENTIAL: Symbol.for('SEQUENTIAL'),

	/**
	 * Conditions are shuffled within each repeat.
	 */
	RANDOM: Symbol.for('RANDOM'),

	/**
	 * Conditions are fully randomised across all repeats.
	 */
	FULL_RANDOM: Symbol.for('FULL_RANDOM')
};

// *** HELPER FUNCTIONS
// From: https://github.com/tpronk/JASMIN/blob/master/src/Statistics.js
/**
 * Check on repeating elements in array. The elements of array may be primitive types
 * (String, int, float, bool), indexed arrays or associative arrays. However, array
 * needs to be able to be expressed in JSON.
 * @param {Array}  array      Array to check
 * @param {int}    repLength  Number of elements forming one repetition (e.g. "888" forms a repetition with 3 elements)
 * @param {String} index      If defined, the elements of array are themselves indexed or associative arrays; as element, as value, use the value indexed by index in element array
 * @returns true if array contains a repetition of repLength or longer
 */
repetitions = function( array, repLength, index ) {
    // repLength < 2? return true
    if( repLength < 2  ) {
        return true;
    }
    
    // Less elements in array than repLength? return false
    if( array.length < repLength ) {
        return false;
    }

    // Count repetitions via repCounter
    var repCounter  = 1;
    var prevElement = array[0];
    var i, left, right;
    
    // Keep comparing current element with previous element
    for( var i = 1; i < array.length; i++ )
    {
        // Get left and right values to compare
        if( index === undefined )
        {
            left  = prevElement;
            right = array[ i ];
        } else {
            left  = prevElement[ index ];
            right = array[ i ][ index ];
        }
        
        // Left and right are equal? Increase counter, else reset
        if( JSON.stringify( left ) === JSON.stringify( right) )
        {
            repCounter++;
        } else {
            repCounter = 1;
        }
        
        // repCounter at length or more? return true
        if( repCounter >= repLength )
        {
            return true;
        }
        
        // Make current element previous element
        prevElement = array[i];
    }
    
    // Still here? No reps found
    return false;
};


// *** RUN TESTS
 
// *** Test the fisherYates shuffle; generate sequences
let frequencies = {}; // Counts frequencies of each order
let shuffleResult;    // Result of current shuffle
for (let i = 0; i < 60000; i++) {
  shuffleResult = util.shuffle([1,2,3]).toString();
  if (shuffleResult in frequencies) {
    frequencies[shuffleResult]++;
  } else {
    frequencies[shuffleResult] = 0;
  }
}
// Check if each value is in the 95% confidence range
// Obtained lower and upper critical values via this R-script:
// qbinom(0.025, 60000, 1/6) # 9821
// qbinom(0.025, 60000, 1/6, lower.tail = FALSE) # 10179
let passed = true;
for (let frequency_i in Object.keys(frequencies)) {
  frequency = frequencies[frequency_i];
  if (frequency < 9821 || frequency > 10179) {
    passed = false;
  }
}
console.log("Shuffle passed binomial test? " + passed);

// *** Some tests with long sequences
// 
// Setup shim
let trialHandler = new TrialHandler();
trialHandler.nReps = 16;
trialHandler.nStim = 2;
trialHandler.seed = 42;
trialHandler.trialList = {
  keys: function() {
    return ["a", "b"];
  }
};

// Sequential; each next element should alternate
trialHandler.method = TrialHandler.Method.SEQUENTIAL;
shuffleResult = trialHandler._prepareSequence().flat();
//console.log("SEQUENTIAL. shuffleResult: " + shuffleResult);
console.log("SEQUENTIAL. All repetitions shorter than 2? " + !repetitions(shuffleResult, 2));

// Random
trialHandler.method = TrialHandler.Method.RANDOM;
shuffleResult = trialHandler._prepareSequence().flat();
//console.log("RANDOM. shuffleResult: " + shuffleResult);
console.log("RANDOM. All repetitions shorter than 3? " + !repetitions(shuffleResult, 3));

// Full random
trialHandler.method = TrialHandler.Method.FULL_RANDOM;
shuffleResult = trialHandler._prepareSequence().flat();
//console.log("FULL_RANDOM. shuffleResult: " + shuffleResult);
console.log("RANDOM. Any repetitions longer than 2? " + repetitions(shuffleResult, 3));


// *** Tests with same settings as e2e_conditions

// e2e_conditions: random_csv
trialHandler.nReps = 1;
trialHandler.nStim = 4;
trialHandler.trialList.keys = function() {
  return [1, 2, 3, 4];
};
trialHandler.method = TrialHandler.Method.RANDOM;
shuffleResult = trialHandler._prepareSequence().flat();
console.log("random_csv. shuffleResult == 4,2,3,1? " + (shuffleResult.toString() === "4,2,3,1"));

// e2e_conditions: random_xlsx
trialHandler.nReps = 2;
trialHandler.nStim = 2;
trialHandler.trialList.keys = function() {
  return ["a", "b"];
};
trialHandler.method = TrialHandler.Method.RANDOM;
shuffleResult = trialHandler._prepareSequence().flat();
console.log("random_xlsx. shuffleResult == b,a,a,b? " + (shuffleResult.toString() === "b,a,a,b"));

// e2e_conditions: random_funky
trialHandler.nReps = 3;
trialHandler.nStim = 2;
trialHandler.trialList.keys = function() {
  return [1, 2];
};
trialHandler.method = TrialHandler.Method.FULL_RANDOM;
shuffleResult = trialHandler._prepareSequence().flat();
console.log("random_funky. shuffleResult == 2,1,1,2,1,2? " + (shuffleResult.toString() === "2,1,1,2,1,2"));
console.log("random_funky. shuffleResult is " + shuffleResult.toString());
