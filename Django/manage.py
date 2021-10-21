#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from pathlib import Path

def main():
    """Run administrative tasks."""
    current_path = Path(__file__).parent.resolve()
    
    # env = environ.Env()
    # env.read_env(str(current_path / ".env.local"))

    # DEBUG = os.environ.get('DEBUG', True)

    # if DEBUG:
    #     os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'admin.settings.local')
    # else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'admin.settings.local')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    
    sys.path.append(str(current_path / "apps"))
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
