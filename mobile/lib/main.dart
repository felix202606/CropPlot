import 'package:flutter/material.dart';

import 'db/garden_db.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const CropPlotApp());
}

class CropPlotApp extends StatelessWidget {
  const CropPlotApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CropPlot',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF2E8747)),
        useMaterial3: true,
      ),
      home: const GardenPage(),
    );
  }
}

class GardenPage extends StatefulWidget {
  const GardenPage({super.key});

  @override
  State<GardenPage> createState() => _GardenPageState();
}

class _GardenPageState extends State<GardenPage> {
  late final Future<GardenDb> _db = GardenDb.open();
  List<Bed> _beds = [];
  List<Planting> _due = [];

  Future<void> _reload() async {
    final db = await _db;
    final beds = await db.beds();
    final due = await db.dueToday();
    if (!mounted) return;
    setState(() {
      _beds = beds;
      _due = due;
    });
  }

  @override
  void initState() {
    super.initState();
    _reload();
  }

  Future<void> _addBed() async {
    final name = await _ask(context, title: 'New bed', hint: 'Backyard Bed A');
    if (name == null || name.isEmpty) return;
    await (await _db).addBed(name);
    await _reload();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('CropPlot')),
      floatingActionButton: FloatingActionButton(onPressed: _addBed, child: const Icon(Icons.add)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text('Water today', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
          if (_due.isEmpty)
            const Text('Nothing to water today.')
          else
            ..._due.map((p) => Card(child: ListTile(leading: const Text('💧'), title: Text(p.plantName)))),
          const SizedBox(height: 24),
          Text('Beds', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
          if (_beds.isEmpty)
            const Text('Add your first bed.')
          else
            ..._beds.map(
              (bed) => Card(
                child: ListTile(
                  leading: const Text('🪴'),
                  title: Text(bed.name),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () async {
                    await Navigator.push(context, MaterialPageRoute(builder: (_) => BedPage(db: _db, bed: bed)));
                    await _reload();
                  },
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class BedPage extends StatefulWidget {
  const BedPage({super.key, required this.db, required this.bed});
  final Future<GardenDb> db;
  final Bed bed;

  @override
  State<BedPage> createState() => _BedPageState();
}

class _BedPageState extends State<BedPage> {
  List<Planting> _plantings = [];

  Future<void> _reload() async {
    final plantings = await (await widget.db).plantings(widget.bed.id);
    if (!mounted) return;
    setState(() => _plantings = plantings);
  }

  @override
  void initState() {
    super.initState();
    _reload();
  }

  Future<void> _addPlant() async {
    final name = await _ask(context, title: 'Add plant', hint: 'Tomato');
    if (name == null || name.isEmpty) return;
    await (await widget.db).addPlanting(bedId: widget.bed.id, plantName: name, waterEveryDays: 3);
    await _reload();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.bed.name)),
      floatingActionButton: FloatingActionButton(onPressed: _addPlant, child: const Icon(Icons.add)),
      body: _plantings.isEmpty
          ? const Center(child: Text('No plants yet. Add one to start watering reminders.'))
          : ListView(
              children: _plantings
                  .map(
                    (p) => ListTile(
                      title: Text(p.plantName),
                      subtitle: Text(
                        wateringDue(p.plantedOn, p.waterEveryDays, DateTime.now())
                            ? 'Water today · every ${p.waterEveryDays} days'
                            : 'Every ${p.waterEveryDays} days',
                      ),
                    ),
                  )
                  .toList(),
            ),
    );
  }
}

Future<String?> _ask(BuildContext context, {required String title, required String hint}) {
  final controller = TextEditingController();
  return showDialog<String>(
    context: context,
    builder: (context) => AlertDialog(
      title: Text(title),
      content: TextField(controller: controller, autofocus: true, decoration: InputDecoration(hintText: hint)),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
        FilledButton(onPressed: () => Navigator.pop(context, controller.text.trim()), child: const Text('Save')),
      ],
    ),
  );
}
