/**
 * Python Package Database — stdlib + Top 100 PyPI packages.
 *
 * Used for hallucinated import detection in offline mode
 * (when PyPI is not available).
 *
 * @since 0.5.0
 */

export const PYTHON_STANDARD_LIBRARY = new Set([
  // Core
  'os', 'sys', 're', 'json', 'math', 'random', 'datetime', 'time', 'calendar',
  'pathlib', 'typing', 'collections', 'functools', 'itertools', 'operator',
  'io', 'string', 'textwrap', 'unicodedata', 'difflib', 'inspect',

  // System
  'subprocess', 'shutil', 'tempfile', 'logging', 'unittest', 'argparse',
  'signal', 'ctypes', 'platform', 'os.path', 'os.name',
  'multiprocessing', 'threading', 'concurrent', 'concurrent.futures',
  'asyncio', 'sched', 'queue', 'traceback', 'linecache',
  'pdb', 'profile', 'pstats', 'timeit', 'dis',

  // Crypto / encoding
  'hashlib', 'hmac', 'secrets', 'base64', 'binascii', 'codecs',
  'quopri', 'uu', 'zlib', 'gzip', 'bz2', 'lzma', 'zipfile', 'tarfile',
  'pickle', 'shelve', 'dbm', 'sqlite3', 'csv', 'configparser',
  'netrc', 'plistlib', 'cryptography',

  // Network
  'urllib', 'urllib.parse', 'urllib.request', 'urllib.response',
  'urllib.error', 'urllib.robotparser',
  'http', 'http.client', 'http.server', 'http.cookiejar', 'http.cookies',
  'socket', 'socketserver', 'ssl', 'smtplib', 'email', 'email.mime',
  'xmlrpc', 'ipaddress', 'webbrowser',

  // Data formats
  'xml', 'xml.etree', 'xml.dom', 'xml.sax', 'xml.parsers', 'html',
  'html.parser', 'html.entities',
  'struct', 'array', 'weakref', 'types', 'copy', 'pprint',
  'reprlib', 'enum', 'numbers', 'decimal', 'fractions',

  // OOP / patterns
  'abc', 'dataclasses', 'contextlib', 'warnings', 'contextvars',

  // File formats
  'csv', 'tomllib', 'tomli', 'wave', 'aifc', 'sunau',
  'colorsys', 'imghdr', 'sndhdr', 'ossaudiodev',

  // Misc
  'atexit', 'site', 'runpy', 'importlib', 'importlib.metadata',
  'importlib.resources', 'importlib.abc', 'pkgutil', 'pkg_resources',
  'zipimport', 'zoneinfo', 'graphlib', 'token', 'tokenize',
  'keyword', 'token', 'ast', 'symtable', 'symbol', 'parser',
  'code', 'codeop', 'compileall', 'py_compile',
  'pyclbr', 'pydoc', 'doctest', 'optparse',
  'gettext', 'locale', 'resource', 'stat',
  'posixpath', 'ntpath', 'genericpath', 'posix', 'pwd', 'grp',
  'mmap', 'msvcrt', 'termios', 'tty',
  'glob', 'fnmatch', 'linecache', 'warnings',

  // Test
  'unittest', 'unittest.mock', 'unittest.mock',
  'doctest', 'test', 'test.support',

  // Tk (GUI)
  'tkinter',

  // IDLE
  'idlelib',

  // Command line
  'cmd', 'shlex', 'readline', 'rlcompleter',
]);

/**
 * Top 100 most popular PyPI packages.
 */
export const PYTHON_THIRD_PARTY = new Set([
  'requests', 'urllib3', 'certifi', 'chardet', 'idna', 'charset-normalizer',
  'setuptools', 'pip', 'wheel', 'six',
  'numpy', 'pandas', 'matplotlib', 'scipy', 'scikit-learn', 'sklearn',
  'statsmodels', 'sympy', 'networkx', 'seaborn',
  'pillow', 'PIL', 'opencv-python', 'cv2',
  'flask', 'django', 'fastapi', 'uvicorn', 'starlette', 'gunicorn',
  'aiohttp', 'tornado', 'sanic', 'bottle', 'pyramid',
  'celery', 'redis', 'rq', 'huey',
  'sqlalchemy', 'alembic', 'peewee', 'pony', 'sqlmodel',
  'psycopg2', 'psycopg', 'pg8000', 'asyncpg',
  'pymongo', 'pymysql', 'aiomysql',
  'pytest', 'pytest-cov', 'pytest-mock', 'pytest-asyncio',
  'unittest2', 'nose', 'nose2', 'tox', 'coverage', 'flake8', 'pylint',
  'mypy', 'black', 'isort', 'pylint', 'bandit', 'ruff',
  'pydantic', 'attrs', 'marshmallow', 'dataclasses', 'pydantic-core',
  'click', 'typer', 'rich', 'prompt-toolkit',
  'boto3', 'botocore', 'google-cloud-storage', 'google-cloud-bigquery',
  'azure-storage-blob', 'azure-identity',
  'kafka-python', 'confluent-kafka', 'pika',
  'httpx', 'websockets', 'websocket-client',
  'python-dotenv', 'pyyaml', 'toml', 'ruamel.yaml',
  'cryptography', 'paramiko', 'bcrypt', 'passlib',
  'jwt', 'pyjwt', 'authlib',
  'loguru', 'structlog',
  'sentry-sdk',
  'beautifulsoup4', 'bs4', 'lxml', 'mechanize',
  'selenium', 'playwright',
  'scrapy',
  'arrow', 'pendulum', 'dateutil', 'python-dateutil',
  'jinja2', 'markupsafe', 'mako', 'cheetah3',
  'boto3', 'google-api-python-client', 'google-auth',
  'paramiko', 'fabric', 'invoke',
  'docker', 'docker-compose',
  'pydantic', 'httpx', 'anyio', 'trio',
  'orjson', 'ujson', 'msgpack', 'protobuf',
  'retry', 'tenacity', 'backoff',
  'validators', 'email-validator',
  'python-jose', 'cryptography',
  'tqdm',
  'tabulate',
  'patchworklib',
]);

/** Combined Python package set. */
export const PYTHON_ALL_KNOWN_PACKAGES = new Set([
  ...PYTHON_STANDARD_LIBRARY,
  ...PYTHON_THIRD_PARTY,
]);
