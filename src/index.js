const fs = require("fs");
const slash = require("./slash.js");
const vowels = ["æ", "a", "e", "ɛ", "i", "ɑ", "ɯ", "ʌ"];
const consonants = ["b", "ʧ", "d", "f", "g", "ʤ", "k", "l", "m", "n", "p", "ɹ", "s", "t", "v", "j", "z"];
const characterMap = {
	"æ": "a",
	"a": "a",
	"b": "b",
	"ʧ": "ch",
	"d": "d",
	"e": "e",
	"ɛ": "e",
	"f": "f",
	"g": "g",
	"i": "i",
	"ʤ": "j",
	"k": "k",
	"l": "l",
	"m": "m",
	"n": "n",
	"ɑ": "o",
	"p": "p",
	"ɹ": "r",
	"s": "s",
	"t": "t",
	"ɯ": "u",
	"ʌ": "u",
	"v": "v",
	"j": "y",
	"z": "z"
};
const modifiers = [];
const conjunctions = [];
const pronouns = [];
const nouns = [];
const verbs = [];
const adjectives = [];
const prepositions = [];
const modifiersDefinitions = ["definite (the)", "indefinite (a)", "plural", "past", "present"];
const conjunctionsDefinitions = fs.readFileSync("data/english-conjunctions.txt").toString().split("\n").slice(0, -1);
const pronounsDefinitions = fs.readFileSync("data/english-pronouns.txt").toString().split("\n").slice(0, -1);
const nounsDefinitions = fs.readFileSync("data/english-nouns.txt").toString().split("\n").slice(0, -1);
const verbsDefinitions = fs.readFileSync("data/english-verbs.txt").toString().split("\n").slice(0, -1);
const adjectivesDefinitions = fs.readFileSync("data/english-adjectives.txt").toString().split("\n").slice(0, -1);
const prepositionsDefinitions = fs.readFileSync("data/english-prepositions.txt").toString().split("\n").slice(0, -1);
const frequency = fs.readFileSync("data/english-frequency.txt").toString().split("\n").slice(0, -1);
const map = {};
let seed = 7;

function random() {
	return seed = slash(seed);
}

function randomVowel() {
	return vowels[Math.floor(random() * vowels.length / (0xFFFFFFFF >>> 1))];
}

function randomConsonant() {
	return consonants[Math.floor(random() * consonants.length / (0xFFFFFFFF >>> 1))];
}

function randomVowelTwo() {
	let result;

	do {
		result = randomVowel() + randomConsonant();
	} while (result in map);

	return map[result] = result;
}

function randomVowelThree() {
	let result;

	do {
		result = randomVowel() + randomConsonant() + randomVowel();
	} while (result in map);

	return map[result] = result;
}

function randomConsonantTwo() {
	let result;

	do {
		result = randomConsonant() + randomVowel();
	} while (result in map);

	return map[result] = result;
}

function randomConsonantWord(definition) {
	let result;

	do {
		let length = frequency.indexOf(definition);
		result = randomConsonant();

		if (length === -1) {
			length = definition.length / 3;
		} else {
			length = 2 * length / frequency.length + 1;
		}

		for (let i = 0; i < length; i++) {
			result += randomVowel() + randomConsonant();
		}
	} while (result in map);

	return map[result] = result;
}

function wordPronunciationDefinition(pronunciation, definition) {
	return `${pronunciation.split("").map(character => characterMap[character]).join("")} /${pronunciation}/ = ${definition}`;
}

for (let i = 0; i < modifiersDefinitions.length; i++) {
	modifiers.push(wordPronunciationDefinition(randomVowelTwo(), modifiersDefinitions[i]));
}

for (let i = 0; i < conjunctionsDefinitions.length; i++) {
	conjunctions.push(wordPronunciationDefinition(randomVowelThree(), conjunctionsDefinitions[i]));
}

for (let i = 0; i < pronounsDefinitions.length; i++) {
	pronouns.push(wordPronunciationDefinition(randomConsonantTwo(), pronounsDefinitions[i]));
}

for (let i = 0; i < nounsDefinitions.length; i++) {
	const nounsDefinition = nounsDefinitions[i];

	nouns.push(wordPronunciationDefinition(randomConsonantWord(nounsDefinition), nounsDefinition));
}

for (let i = 0; i < verbsDefinitions.length; i++) {
	const verbsDefinition = verbsDefinitions[i];

	verbs.push(wordPronunciationDefinition(randomConsonantWord(verbsDefinition), verbsDefinition));
}

for (let i = 0; i < adjectivesDefinitions.length; i++) {
	const adjectivesDefinition = adjectivesDefinitions[i];

	adjectives.push(wordPronunciationDefinition(randomConsonantWord(adjectivesDefinition), adjectivesDefinition));
}

for (let i = 0; i < prepositionsDefinitions.length; i++) {
	const prepositionsDefinition = prepositionsDefinitions[i];

	prepositions.push(wordPronunciationDefinition(randomConsonantWord(prepositionsDefinition), prepositionsDefinition));
}

fs.writeFileSync("data/valon-modifiers.txt", modifiers.join("\n"));
fs.writeFileSync("data/valon-conjunctions.txt", conjunctions.join("\n"));
fs.writeFileSync("data/valon-pronouns.txt", pronouns.join("\n"));
fs.writeFileSync("data/valon-nouns.txt", nouns.join("\n"));
fs.writeFileSync("data/valon-verbs.txt", verbs.join("\n"));
fs.writeFileSync("data/valon-adjectives.txt", adjectives.join("\n"));
fs.writeFileSync("data/valon-prepositions.txt", prepositions.join("\n"));
