const parse = require('./parseStringIntoTokens');

test('Empty string returns no tokens', () => {
  expect(parse('')).toHaveLength(0);
});

test('Whitespace string returns no tokens', () => {
  expect(parse(' ')).toHaveLength(0);
});

test('Non-alphabetic characters return no tokens', () => {
  const weirdString = '@#$%^&*()_+=\';:\",<>/\\|`~⚗〠ൠᴥ௵ஔ∰ጃ෴ᅘ༽໒✺';
  expect(parse(weirdString)).toHaveLength(0);
})

test('String with no spaces returns a single token of letters', () => {
  const result = parse('@t#h$$$$i%n&g*()');
  expect(result).toHaveLength(1);
  expect(result[0]).toBe('thing');
})

test('Sentence returns lowercase alphabetic tokens', () => {
  const text = 'TESTING, One: two Three.';
  const result = parse(text);
  expect(result).toHaveLength(4);
  expect(result).toStrictEqual(['testing', 'one', 'two', 'three']);
})

test('Terminating punctuation (!?.) separates tokens', () => {
  const text = 'testing.one!two?three.';
  const result = parse(text);
  expect(result).toHaveLength(4);
  expect(result).toStrictEqual(['testing', 'one', 'two', 'three']);
})

test('Hyphen separates tokens', () => {
  const text = 'testing- one-two -- three';
  const result = parse(text);
  expect(result).toHaveLength(4);
  expect(result).toStrictEqual(['testing', 'one', 'two', 'three']);
})