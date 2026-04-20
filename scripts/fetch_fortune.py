#!/usr/bin/env python3
"""
自动获取闹闹女巫店本周运势数据
支持多种数据源
"""

import json
import re
from datetime import datetime, timedelta
import requests
from bs4 import BeautifulSoup

def get_weekly_fortune():
    """主获取函数"""
    
    zodiacs = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座',
               '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
    }
    
    # 尝试数据源1: 星座百科
    try:
        print("尝试数据源: 星座百科...")
        url = "https://www.xingzuobaike.com/yunshi/zhouyun/"
        response = requests.get(url, headers=headers, timeout=15)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 找到最新周运势文章
        article_links = []
        for link in soup.find_all('a', href=True):
            href = link.get('href', '')
            text = link.get_text()
            if '闹闹女巫' in text or '周运势' in text:
                if href.startswith('/'):
                    href = f"https://www.xingzuobaike.com{href}"
                article_links.append((href, text))
        
        if article_links:
            # 获取最新文章
            article_url = article_links[0][0]
            print(f"获取文章: {article_url}")
            return parse_fortune_page(article_url, headers, zodiacs)
            
    except Exception as e:
        print(f"数据源1失败: {e}")
    
    # 尝试数据源2: 神婆网
    try:
        print("尝试数据源: 神婆网...")
        url = "https://www.shenpowang.com/dashi/nvwudian/"
        response = requests.get(url, headers=headers, timeout=15)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 找到周运势文章
        for link in soup.find_all('a', href=True):
            href = link.get('href', '')
            text = link.get_text()
            if '周运势' in text or '一周运势' in text:
                if href.startswith('/'):
                    href = f"https://www.shenpowang.com{href}"
                return parse_fortune_page(href, headers, zodiacs)
                
    except Exception as e:
        print(f"数据源2失败: {e}")
    
    # 尝试数据源3: 运势大全
    try:
        print("尝试数据源: 运势大全...")
        url = "https://www.yunshidaquan.cn/dashi/nvwudian/"
        response = requests.get(url, headers=headers, timeout=15)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        for link in soup.find_all('a', href=True):
            href = link.get('href', '')
            text = link.get_text()
            if '周运势' in text:
                if href.startswith('/'):
                    href = f"https://www.yunshidaquan.cn{href}"
                return parse_fortune_page(href, headers, zodiacs)
                
    except Exception as e:
        print(f"数据源3失败: {e}")
    
    return None


def parse_fortune_page(url, headers, zodiacs):
    """解析运势页面"""
    
    response = requests.get(url, headers=headers, timeout=15)
    soup = BeautifulSoup(response.text, 'html.parser')
    content = soup.get_text()
    
    # 计算本周日期范围
    today = datetime.now()
    # 找到本周一的日期
    monday = today - timedelta(days=today.weekday())
    sunday = monday + timedelta(days=6)
    week_str = f"{monday.month}.{monday.day}-{sunday.month}.{sunday.day}"
    
    fortune_data = {
        "source": "闹闹女巫店",
        "crawled_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "week": week_str,
        "rankings": {"top": [], "bottom": []},
        "horoscopes": {}
    }
    
    # 提取周数（从页面内容）
    week_match = re.search(r'(\d{1,2}\.\d{1,2}-\d{1,2}\.\d{1,2})', response.text)
    if week_match:
        fortune_data['week'] = week_match.group(1)
    
    # 提取排名
    # 前三名
    for i, keyword in enumerate(['第一名', '第二名', '第三名', 'NO.1', 'NO.2', 'NO.3'], 1):
        pattern = rf'{keyword}[：:，,\s]*([^\n，,]+)'
        match = re.search(pattern, content)
        if match:
            text = match.group(1).strip()
            for z in zodiacs:
                if z in text:
                    keyword_text = text.replace(z, '').strip('，, ')
                    fortune_data['rankings']['top'].append({
                        "rank": i if i <= 3 else i-3,
                        "sign": z,
                        "keyword": keyword_text[:20] if keyword_text else ""
                    })
                    break
    
    # 后三名
    for i, keyword in enumerate(['倒数第一', '倒数第二', '倒数第三'], 1):
        pattern = rf'{keyword}[：:，,\s]*([^\n，,]+)'
        match = re.search(pattern, content)
        if match:
            text = match.group(1).strip()
            for z in zodiacs:
                if z in text:
                    keyword_text = text.replace(z, '').strip('，, ')
                    fortune_data['rankings']['bottom'].append({
                        "rank": i,
                        "sign": z,
                        "keyword": keyword_text[:20] if keyword_text else ""
                    })
                    break
    
    # 解析各星座运势
    for zodiac in zodiacs:
        horoscope = parse_zodiac_content(content, zodiac)
        if horoscope:
            fortune_data['horoscopes'][zodiac] = horoscope
    
    return fortune_data


def parse_zodiac_content(content, zodiac):
    """解析单个星座的运势内容"""
    
    # 查找星座区块
    patterns = [
        rf'{zodiac}[^{{}}]*?(?=白羊座|金牛座|双子座|巨蟹座|狮子座|处女座|天秤座|天蝎座|射手座|摩羯座|水瓶座|双鱼座|本周运势排名|$)',
    ]
    
    zodiac_content = ""
    for pattern in patterns:
        match = re.search(pattern, content, re.DOTALL)
        if match:
            zodiac_content = match.group(0)
            break
    
    if not zodiac_content:
        return None
    
    horoscope = {
        "title": "",
        "description": "",
        "love": "",
        "lucky_number": "",
        "lucky_day": "",
        "lucky_color": "",
        "avoid_sign": "",
        "lucky_sign": ""
    }
    
    # 提取标题（寻找"...的一周"模式）
    title_match = re.search(r'([^\n]{2,8}的一周)', zodiac_content)
    if title_match:
        horoscope['title'] = title_match.group(1).strip()
    
    # 提取描述（寻找较长的句子）
    desc_match = re.search(r'[。\n]([^。\n]{30,150}[。，])', zodiac_content)
    if desc_match:
        horoscope['description'] = desc_match.group(1).strip()
    
    # 提取爱情运
    love_patterns = [
        r'爱情[是为][：:，,]*\s*([^\n。，]+)',
        r'感情[是为][：:，,]*\s*([^\n。，]+)',
    ]
    for pattern in love_patterns:
        match = re.search(pattern, zodiac_content)
        if match:
            horoscope['love'] = match.group(1).strip()
            break
    
    # 提取幸运数字
    num_match = re.search(r'幸运数[字码][：:，,]*\s*(\d+)', zodiac_content)
    if num_match:
        horoscope['lucky_number'] = num_match.group(1)
    
    # 提取幸运日
    day_patterns = [
        r'幸运日[：:，,]*\s*(周[一二三四五六日天])',
        r'幸运日[：:，,]*\s*([一二三四五六日天])',
    ]
    for pattern in day_patterns:
        match = re.search(pattern, zodiac_content)
        if match:
            day = match.group(1)
            if not day.startswith('周'):
                day = '周' + day
            horoscope['lucky_day'] = day
            break
    
    # 提取幸运颜色
    color_match = re.search(r'幸运色[：:，,]*\s*([^\s，,\n。]+)', zodiac_content)
    if color_match:
        horoscope['lucky_color'] = color_match.group(1).strip()
    
    # 提取需避开星座
    avoid_patterns = [
        r'(?:需避|避开|不宜|避免)[^星座]*星座[：:，,]*\s*([^\s，,\n。]+)',
        r'(?:需避|避开|不宜)[：:，,]*\s*([^\s，,\n。]+座)',
    ]
    for pattern in avoid_patterns:
        match = re.search(pattern, zodiac_content)
        if match:
            horoscope['avoid_sign'] = match.group(1).strip()
            break
    
    # 提取契合星座
    lucky_sign_patterns = [
        r'(?:契合|幸运星|贵人|契合星座)[：:，,]*\s*([^\s，,\n。]+)',
        r'(?:契合|合得来)[^星座]*([^\s，,\n。]+座)',
    ]
    for pattern in lucky_sign_patterns:
        match = re.search(pattern, zodiac_content)
        if match:
            horoscope['lucky_sign'] = match.group(1).strip()
            break
    
    return horoscope


def main():
    print(f"[{datetime.now()}] 开始获取本周运势...")
    
    data = get_weekly_fortune()
    
    if data:
        # 验证数据有效性
        if len(data.get('horoscopes', {})) >= 8:  # 至少8个星座有数据
            with open('data/weekly-fortune.json', 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"✅ 运势数据已更新: {data['week']}")
            print(f"   包含 {len(data['horoscopes'])} 个星座数据")
            return True
        else:
            print(f"⚠️ 数据不完整，仅 {len(data.get('horoscopes', {}))} 个星座")
            return False
    else:
        print("❌ 获取运势数据失败")
        return False


if __name__ == '__main__':
    import os
    os.chdir('/workspace/miwu-fortune')
    main()
