"""
自定义解析器：接受 text/plain 并按 JSON 解析（部分前端会发 text/plain;charset=UTF-8）。
"""
import json
from rest_framework import parsers
from rest_framework.exceptions import ParseError


class PlainTextJSONParser(parsers.JSONParser):
    """接受 Content-Type: text/plain，将 body 按 JSON 解析。"""
    media_type = 'text/plain'

    def parse(self, stream, media_type=None, parser_context=None):
        parser_context = parser_context or {}
        encoding = parser_context.get('encoding', 'utf-8')
        try:
            data = stream.read().decode(encoding)
            return json.loads(data)
        except (ValueError, json.JSONDecodeError) as e:
            raise ParseError(f'JSON 解析失败: {e}')
