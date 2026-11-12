import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

class Bed {
  Bed({required this.id, required this.name});
  final int id;
  final String name;
}

class Planting {
  Planting({
    required this.id,
    required this.bedId,
    required this.plantName,
    required this.plantedOn,
    required this.waterEveryDays,
  });
  final int id;
  final int bedId;
  final String plantName;
  final DateTime plantedOn;
  final int waterEveryDays;
}

/// True on the planting day and every `everyDays` days after that.
bool wateringDue(DateTime plantedOn, int everyDays, DateTime now) {
  final planted = DateTime(plantedOn.year, plantedOn.month, plantedOn.day);
  final today = DateTime(now.year, now.month, now.day);
  final days = today.difference(planted).inDays;
  if (days < 0 || everyDays <= 0) return false;
  return days % everyDays == 0;
}

class GardenDb {
  GardenDb(this._db);
  final Database _db;

  static Future<GardenDb> open() async {
    final db = await openDatabase(
      join(await getDatabasesPath(), 'cropplot.db'),
      version: 1,
      onConfigure: (db) => db.execute('PRAGMA foreign_keys = ON'),
      onCreate: (db, version) async {
        await db.execute('''
          create table beds (
            id integer primary key autoincrement,
            name text not null,
            created_at integer not null
          )
        ''');
        await db.execute('''
          create table plantings (
            id integer primary key autoincrement,
            bed_id integer not null references beds(id) on delete cascade,
            plant_name text not null,
            planted_on integer not null,
            water_every_days integer not null default 3
          )
        ''');
      },
    );
    return GardenDb(db);
  }

  Future<List<Bed>> beds() async {
    final rows = await _db.query('beds', orderBy: 'created_at desc');
    return rows.map((row) => Bed(id: row['id'] as int, name: row['name'] as String)).toList();
  }

  Future<Bed> addBed(String name) async {
    final id = await _db.insert('beds', {'name': name, 'created_at': DateTime.now().millisecondsSinceEpoch});
    return Bed(id: id, name: name);
  }

  Future<List<Planting>> plantings(int bedId) async {
    final rows = await _db.query('plantings', where: 'bed_id = ?', whereArgs: [bedId], orderBy: 'planted_on desc');
    return rows.map(_planting).toList();
  }

  Future<List<Planting>> dueToday() async {
    final rows = await _db.query('plantings');
    final now = DateTime.now();
    return rows.map(_planting).where((p) => wateringDue(p.plantedOn, p.waterEveryDays, now)).toList();
  }

  Future<void> addPlanting({required int bedId, required String plantName, required int waterEveryDays}) async {
    await _db.insert('plantings', {
      'bed_id': bedId,
      'plant_name': plantName,
      'planted_on': DateTime.now().millisecondsSinceEpoch,
      'water_every_days': waterEveryDays,
    });
  }

  Planting _planting(Map<String, Object?> row) {
    return Planting(
      id: row['id'] as int,
      bedId: row['bed_id'] as int,
      plantName: row['plant_name'] as String,
      plantedOn: DateTime.fromMillisecondsSinceEpoch(row['planted_on'] as int),
      waterEveryDays: row['water_every_days'] as int,
    );
  }
}
