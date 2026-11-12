import 'package:cropplot_app/db/garden_db.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('watering is due on the planting day and every interval after', () {
    final planted = DateTime(2026, 11, 12);
    expect(wateringDue(planted, 3, DateTime(2026, 11, 12)), isTrue);
    expect(wateringDue(planted, 3, DateTime(2026, 11, 13)), isFalse);
    expect(wateringDue(planted, 3, DateTime(2026, 11, 15)), isTrue);
    expect(wateringDue(planted, 3, DateTime(2026, 11, 11)), isFalse);
  });
}
