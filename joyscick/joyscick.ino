const int JOY_X = A1;
const int JOY_Y = A2;

void setup()
{
	Serial.begin(9600);
}

void loop()
{
	int rawX = analogRead(JOY_X); // 0–1023
	int rawY = analogRead(JOY_Y);

	int x = map(rawX, 0, 1023, 0, 9);
	int y = map(rawY, 0, 1023, 0, 9);

	Serial.print(x);
	Serial.print(" ");
	Serial.println(y);

	delay(100);
}
