#!/usr/bin/env python
"""
本地导出数据为 UTF-8 的 data_export.json，避免 Windows 下 dumpdata -o 的编码错误。
用法（在 BasscBackend 目录、已激活 venv）：python scripts/export_data.py
"""
import os
import sys

# 确保能加载 Django
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.core.management import call_command

def main():
    out_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data_export.json')
    with open(out_path, 'w', encoding='utf-8') as f:
        call_command('dumpdata', '--natural-foreign', '--natural-primary', '--indent', '2', stdout=f)
    print(f'已导出到 {out_path}')

if __name__ == '__main__':
    main()
