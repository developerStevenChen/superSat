# Update stored links after removing /class prefix from program URLs

from django.db import migrations


def fix_program_paths(apps, schema_editor):
    Board = apps.get_model('api', 'Board')
    NavItem = apps.get_model('api', 'NavItem')

    Board.objects.filter(link='/class').update(link='/program')
    for board in Board.objects.filter(link__startswith='/class/'):
        board.link = board.link[len('/class'):]
        board.save(update_fields=['link'])

    NavItem.objects.filter(path='/class').update(path='/program')
    for item in NavItem.objects.filter(path__startswith='/class/'):
        item.path = item.path[len('/class'):]
        item.save(update_fields=['path'])


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0019_athlete_activity_name'),
    ]

    operations = [
        migrations.RunPython(fix_program_paths, migrations.RunPython.noop),
    ]
