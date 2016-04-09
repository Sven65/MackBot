# MackBot
A discord bot

## Math system

| Operator | Name | Syntax | Associativity | Example | Result |
| --- | --- | --- | --- | --- | --- |
| `(`, `)` | Grouping | `(x)` | None | `2 * (3 + 4)` | `14` |
| `[`, `]` | Matrix, Index | `[...]` | None | `[[1,2],[3,4]]` | `[[1,2],[3,4]]` |
| `,` | Parameter separator | `x, y` | Left to right | `max(2, 1, 5)` | `5` |
| `.` | Property accessor | `obj.prop` | Left to right | `obj={a: 12}; obj.a` | `12` |
| `;` | Statement separator | `x; y` | Left to right | `a=2; b=3; a*b` | `[6]` |
| `;` | Row separator | `[x, y]` | Left to right | `[1,2;3,4]` | `[[1,2],[3,4]]` |
| `\n` | Statement separator | `x \n y` | Left to right | `a=2 \n b=3 \n a*b` | `[2,3,6]` |
| `+` | Add | `x + y` | Left to right | `4 + 5` | `9` |
| `+` | Unary plus | `+y` | Right to left | `+4` | `4` |
| `-` | Subtract | `x - y` | Left to right | `7 - 3` | `4` |
| `-` | Unary minus | `-y` | Right to left | `-4` | `-4` |
| `*` | Multiply | `x * y` | Left to right | `2 * 3` | `6` |
| `.*` | Element-wise multiply | `x .* y` | Left to right | `[1,2,3] .* [1,2,3]` | `[1,4,9]` |
| `/` | Divide | `x / y` | Left to right | `6 / 2` | `3` |
| `./` | Element-wise divide | `x ./ y` | Left to right | `[9,6,4] ./ [3,2,2]` | `[3,3,2]` |
| `%`, `mod` | Modulus | `x % y` | Left to right | `8 % 3` | `2` |
| `^` | Power | `x ^ y` | Right to left | `2 ^ 3` | `8` |
| `.^` | Element-wise power | `x .^ y` | Right to left | `[2,3] .^ [3,3]` | `[9,27]` |
| `'` | Transpose | `y'` | Left to right | `[[1,2],[3,4]]'` | `[[1,3],[2,4]]` |
| `!` | Factorial | `y!` | Left to right | `5!` | `120` |
| `&` | Bitwise and | `x & y` | Left to right | `5 & 3` | `1` |
| `~` | Bitwise not | `~x` | Right to left | `~2` | `-3` |
| `|` | Bitwise or | `x | y` | Left to right | `5 | 3` | `7` |
| `^|` | Bitwise xor | `x ^| y` | Left to right | `5 ^| 2` | `6` |
| `<<` | Left shift | `x << y` | Left to right | `4 << 1` | `8` |
| `>>` | Right arithmetic shift | `x >> y` | Left to right | `8 >> 1` | `4` |
| `>>>` | Right logical shift | `x >>> y` | Left to right | `-8 >>> 1` | `2147483644` |
| `and` | Logical and | `x and y` | Left to right | `true and false` | `false` |
| `not` | Logical not | `not y` | Right to left | `not true` | `false` |
| `or` | Logical or | `x or y` | Left to right | `true or false` | `true` |
| `xor` | Logical xor | `x xor y` | Left to right | `true xor true` | `false` |
| `=` | Assignment | `x = y` | Right to left | `a = 5` | `5` |
| `?` `:` | Conditional expression | `x ? y : z` | Right to left | `15 > 100 ? 1 : -1` | `-1` |
| `:` | Range | `x : y` | Right to left | `1:4` | `[1,2,3,4]` |
| `to`, `in` | Unit conversion | `x to y` | Left to right | `2 inch to cm` | `5.08 cm` |
| `==` | Equal | `x == y` | Left to right | `2 == 4 - 2` | `true` |
| `!=` | Unequal | `x != y` | Left to right | `2 != 3` | `true` |
| `<` | Smaller | `x < y` | Left to right | `2 < 3` | `true` |
| `>` | Larger | `x > y` | Left to right | `2 > 3` | `false` |
| `<=` | Smallereq | `x <= y` | Left to right | `4 <= 3` | `false` |
| `>=` | Largereq | `x >= y` | Left to right | `2 + 4 >= 6` | `true` |


## Constants

| Constant | Description | Value |
| --- | --- | --- |
| `e`, `E` | Euler’s number, the base of the natural logarithm. | 2.718281828459045 |
| `i` | Imaginary unit, defined as i_i=-1\. A complex number is described as a + b_i, where a is the real part, and b is the imaginary part. | `sqrt(-1)` |
| `Infinity` | Infinity, a number which is larger than the maximum number that can be handled by a floating point number. | `Infinity` |
| `LN2` | Returns the natural logarithm of 2. | `0.6931471805599453` |
| `LN10` | Returns the natural logarithm of 10. | `2.302585092994046` |
| `LOG2E` | Returns the base-2 logarithm of E. | `1.4426950408889634` |
| `LOG10E` | Returns the base-10 logarithm of E. | `0.4342944819032518` |
| `NaN` | Not a number. | `NaN` |
| `null` | Value null. | `null` |
| `phi` | Phi is the golden ratio. Two quantities are in the golden ratio if their ratio is the same as the ratio of their sum to the larger of the two quantities. Phi is defined as `(1 + sqrt(5)) / 2` | `1.618033988749895` |
| `pi`, `PI` | The number pi is a mathematical constant that is the ratio of a circle's circumference to its diameter. | `3.141592653589793` |
| `SQRT1_2` | Returns the square root of 1/2. | `0.7071067811865476` |
| `SQRT2` | Returns the square root of 2. | `1.4142135623730951` |
| `tau` | Tau is the ratio constant of a circle's circumference to radius, equal to `2 * pi`. | `6.283185307179586` |
| `uninitialized` | Constant used as default value when resizing a matrix to leave new entries uninitialized. |

## Units

| Base | Unit |
| --- | --- |
| Length | meter (m), inch (in), foot (ft), yard (yd), mile (mi), link (li), rod (rd), chain (ch), angstrom, mil |
| Surface area | m2, sqin, sqft, sqyd, sqmi, sqrd, sqch, sqmil, acre, hectare |
| Volume | m3, litre (l, L, lt, liter), cc, cuin, cuft, cuyd, teaspoon, tablespoon |
| Liquid volume | minim (min), fluiddram (fldr), fluidounce (floz), gill (gi), cup (cp), pint (pt), quart (qt), gallon (gal), beerbarrel (bbl), oilbarrel (obl), hogshead, drop (gtt) |
| Angles | rad (radian), deg (degree), grad (gradian), cycle, arcsec (arcsecond), arcmin (arcminute) |
| Time | second (s, secs, seconds), minute (mins, minutes), hour (h, hr, hrs, hours), day (days), week (weeks), month (months), year (years), decade (decades), century (centuries), millennium (millennia) |
| Frequency | hertz (Hz) |
| Mass | gram(g), tonne, ton, grain (gr), dram (dr), ounce (oz), poundmass (lbm, lb, lbs), hundredweight (cwt), stick, stone |
| Electric current | ampere (A) |
| Temperature | kelvin (K), celsius (degC), fahrenheit (degF), rankine (degR) |
| Amount of substance | mole (mol) |
| Luminous intensity | candela (cd) |
| Force | newton (N), dyne (dyn), poundforce (lbf), kip |
| Energy | joule (J), erg, Wh, BTU, electronvolt (eV) |
| Power | watt (W), hp |
| Pressure | Pa, psi, atm, torr, bar, mmHg, mmH2O, cmH2O |
| Electricity and magnetism | ampere (A), coulomb (C), watt (W), volt (V), ohm, farad (F), weber (Wb), tesla (T), henry (H), siemens (S), electronvolt (eV) |
| Binary | bit (b), byte (B) |

## Prefixes

| Name | Abbreviation | Value |
| --- | --- | --- |
| deca | da | 1e1 |
| hecto | h | 1e2 |
| kilo | k | 1e3 |
| mega | M | 1e6 |
| giga | G | 1e9 |
| tera | T | 1e12 |
| peta | P | 1e15 |
| exa | E | 1e18 |
| zetta | Z | 1e21 |
| yotta | Y | 1e24 |

| Name | Abbreviation | Value |
| --- | --- | --- |
| deci | d | 1e-1 |
| centi | c | 1e-2 |
| milli | m | 1e-3 |
| micro | u | 1e-6 |
| nano | n | 1e-9 |
| pico | p | 1e-12 |
| femto | f | 1e-15 |
| atto | a | 1e-18 |
| zepto | z | 1e-21 |
| yocto | y | 1e-24 |

| Name | Abbreviation | Value |
| --- | --- | --- |
| kibi | Ki | 1024 |
| mebi | Mi | 1024^2 |
| gibi | Gi | 1024^3 |
| tebi | Ti | 1024^4 |
| pebi | Pi | 1024^5 |
| exi | Ei | 1024^6 |
| zebi | Zi | 1024^7 |
| yobi | Yi | 1024^8 |

| Name | Abbreviation | Value |
| --- | --- | --- |
| kilo | k | 1e3 |
| mega | M | 1e6 |
| giga | G | 1e9 |
| tera | T | 1e12 |
| peta | P | 1e15 |
| exa | E | 1e18 |
| zetta | Z | 1e21 |
| yotta | Y | 1e24 |

### Arithmetic functions

| Function | Description |
| --- | --- |
| abs(x) | Calculate the absolute value of a number. |
| cbrt(x [, allRoots]) | Calculate the cubic root of a value. |
| ceil(x) | Round a value towards plus infinity If `x` is complex, both real and imaginary part are rounded towards plus infinity. |
| cube(x) | Compute the cube of a value, `x * x * x`. |
| dotDivide(x, y) | Divide two matrices element wise. |
| dotMultiply(x, y) | Multiply two matrices element wise. |
| dotPow(x, y) | Calculates the power of x to y element wise. |
| exp(x) | Calculate the exponent of a value. |
| fix(x) | Round a value towards zero. |
| floor(x) | Round a value towards minus infinity. |
| gcd(a, b) | Calculate the greatest common divisor for two or more values or arrays. |
| hypot(a, b, …) | Calculate the hypotenusa of a list with values. |
| lcm(a, b) | Calculate the least common multiple for two or more values or arrays. |
| log(x [, base]) | Calculate the logarithm of a value. |
| log10(x) | Calculate the 10-base logarithm of a value. |
| mod(x, y) | Calculates the modulus, the remainder of an integer division. |
| norm(x [, p]) | Calculate the norm of a number, vector or matrix. |
| nthRoot(a) | Calculate the nth root of a value. |
| pow(x, y) | Calculates the power of x to y, `x ^ y`. |
| round(x [, n]) | Round a value towards the nearest integer. |
| sign(x) | Compute the sign of a value. |
| sqrt(x) | Calculate the square root of a value. |
| square(x) | Compute the square of a value, `x * x`. |
| unaryMinus(x) | Inverse the sign of a value, apply a unary minus operation. |
| unaryPlus(x) | Unary plus operation. |
| xgcd(a, b) | Calculate the extended greatest common divisor for two values. |

### Bitwise functions

| Function | Description |
| --- | --- |
| bitAnd(x, y) | Bitwise AND two values, `x & y`. |
| bitNot(x) | Bitwise NOT value, `~x`. |
| bitOr(x, y) | Bitwise OR two values, `x | y`. |
| bitXor(x, y) | Bitwise XOR two values, `x ^ y`. |
| leftShift(x, y) | Bitwise left logical shift of a value x by y number of bits, `x << y`. |
| rightArithShift(x, y) | Bitwise right arithmetic shift of a value x by y number of bits, `x >> y`. |
| rightLogShift(x, y) | Bitwise right logical shift of value x by y number of bits, `x >>> y`. |

### Probability functions

| Function | Description |
| --- | --- |
| combinations(n, k) | Compute the number of ways of picking `k` unordered outcomes from `n` possibilities. |
| factorial(n) | Compute the factorial of a value Factorial only supports an integer value as argument. |
| gamma(n) | Compute the gamma function of a value using Lanczos approximation for small values, and an extended Stirling approximation for large values. |
| kldivergence(x, y) | Calculate the Kullback-Leibler (KL) divergence between two distributions. |
| multinomial(a) | Multinomial Coefficients compute the number of ways of picking a1, a2, . |
| permutations(n [, k]) | Compute the number of ways of obtaining an ordered subset of `k` elements from a set of `n` elements. |
| pickRandom(array) | Random pick a value from a one dimensional array. |
| random([min, max]) | Return a random number larger or equal to `min` and smaller than `max` using a uniform distribution. |
| randomInt([min, max]) | Return a random integer number larger or equal to `min` and smaller than `max` using a uniform distribution. |

### Trigonometry functions

| Function | Description |
| --- | --- |
| acos(x) | Calculate the inverse cosine of a value. |
| acosh(x) | Calculate the hyperbolic arccos of a value, defined as `acosh(x) = ln(sqrt(x^2 - 1) + x)`. |
| acot(x) | Calculate the inverse cotangent of a value, defined as `acot(x) = atan(1/x)`. |
| acoth(x) | Calculate the hyperbolic arccotangent of a value, defined as `acoth(x) = atanh(1/x) = (ln((x+1)/x) + ln(x/(x-1))) / 2`. |
| acsc(x) | Calculate the inverse cosecant of a value, defined as `acsc(x) = asin(1/x)`. |
| acsch(x) | Calculate the hyperbolic arccosecant of a value, defined as `acsch(x) = asinh(1/x) = ln(1/x + sqrt(1/x^2 + 1))`. |
| asec(x) | Calculate the inverse secant of a value. |
| asech(x) | Calculate the hyperbolic arcsecant of a value, defined as `asech(x) = acosh(1/x) = ln(sqrt(1/x^2 - 1) + 1/x)`. |
| asin(x) | Calculate the inverse sine of a value. |
| asinh(x) | Calculate the hyperbolic arcsine of a value, defined as `asinh(x) = ln(x + sqrt(x^2 + 1))`. |
| atan(x) | Calculate the inverse tangent of a value. |
| atan2(y, x) | Calculate the inverse tangent function with two arguments, y/x. |
| atanh(x) | Calculate the hyperbolic arctangent of a value, defined as `atanh(x) = ln((1 + x)/(1 - x)) / 2`. |
| cos(x) | Calculate the cosine of a value. |
| cosh(x) | Calculate the hyperbolic cosine of a value, defined as `cosh(x) = 1/2 * (exp(x) + exp(-x))`. |
| cot(x) | Calculate the cotangent of a value. |
| coth(x) | Calculate the hyperbolic cotangent of a value, defined as `coth(x) = 1 / tanh(x)`. |
| csc(x) | Calculate the cosecant of a value, defined as `csc(x) = 1/sin(x)`. |
| csch(x) | Calculate the hyperbolic cosecant of a value, defined as `csch(x) = 1 / sinh(x)`. |
| sec(x) | Calculate the secant of a value, defined as `sec(x) = 1/cos(x)`. |
| sech(x) | Calculate the hyperbolic secant of a value, defined as `sech(x) = 1 / cosh(x)`. |
| sin(x) | Calculate the sine of a value. |
| sinh(x) | Calculate the hyperbolic sine of a value, defined as `sinh(x) = 1/2 * (exp(x) - exp(-x))`. |
| tan(x) | Calculate the tangent of a value. |
| tanh(x) | Calculate the hyperbolic tangent of a value, defined as `tanh(x) = (exp(2 * x) - 1) / (exp(2 * x) + 1)`. |




## Todo

* Improve module system
	* Add loading/unloading modules