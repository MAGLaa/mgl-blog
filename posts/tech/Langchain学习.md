## 前提部署大模型

因为刚开始学习所以只用ollama等部署一个小模型

端口：11434

其实可以用厂商线上api，有免费额度，开始使用本地的模型，得到的结果一直不满意还很慢，所以换了线上API，使用了Qwen，配置方式大致一样

## 连接大模型

```python
pip install langchain-openai langchain

pip install python-dotenv
```

```python
# 大模型路径配置 本地
MODEL_PATH=http://localhost:11434/v1

MODEL_NAME=qwen:4b
```

```python
# 加载配置文件
import os 
from dotenv import load_dotenv

base_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(base_dir, "base.env")
# 加载.env文件
load_dotenv(env_path)

LOCAL_BASE_URL = os.getenv("MODEL_PATH")
MODEL_NAME = os.getenv("MODEL_NAME")
```

```python
import openai
from base_set import LOCAL_BASE_URL


llmClient=openai.OpenAI(
    base_url=LOCAL_BASE_URL,
    api_key="sk-",
)
messages = [
    {"role": "user", "content": "中国多大"}
]
resp=llmClient.chat.completions.create(
    model="qwen3-0.6b---",
    messages=messages,
    temperature=0.7
)


print(resp)
```

```python
from langchain_openai import ChatOpenAI

# import openai
from base_set import LOCAL_BASE_URL, MODEL_NAME

# import os
# import time
# from datetime import datetime


# llmClient=openai.OpenAI(
#     base_url=LOCAL_BASE_URL,
#     api_key="sk-",
# )

llm = ChatOpenAI(
    base_url=LOCAL_BASE_URL,
    # 本地部署所有key随便写
    api_key="sk-",
    temperature=0.7,
    model=MODEL_NAME,
    # base_url=LOCAL_BASE_URL, api_key="sk-", temperature=0.7, model="qwen/qwen3-1.7b"
)

# messages = [{"role": "user", "content": "亚洲最美明星"}]
# resp=llmClient.chat.completions.create(
#     model="qwen3-0.6b---",
#     messages=messages,
#     temperature=0.7
# )

# start_time = datetime.now()
# # 调用模型接口
# resp = llmClient.chat.completions.create(
#     model="qwen3-0.6b---",
#     messages=messages,
#     temperature=0.7
# )

# resp = llm.invoke(messages)

# end_time = datetime.now()
# elapsed = (end_time - start_time).total_seconds()


# print(resp)
# print(f"请求耗时: {elapsed:.2f} 秒")
# response = llm.invoke("你好，请用一句话介绍人工智能")
# print("响应结果:", response.content)
```

## 提示词模板

```python
from test1 import llm
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_template(
    "请用{language}介绍一下{topic}，要求简洁明了"
)

messages = prompt.format_messages(language="中文", topic="中国")
print(messages)
print("--------------")
resp = llm.invoke(messages)
print(resp.content)
```

<!-- 这是一张图片，ocr 内容为： -->

![](https://cdn.nlark.com/yuque/0/2025/png/32623986/1765983653590-96676cfa-6468-4f82-a967-d127ece3c650.png)

```json
print(type(resp))
<class 'langchain_core.messages.ai.AIMessage'>
{
  "content=": "中国（China），位于亚洲东部，西接西藏自治区和四川盆地，北临内蒙古自治区、黑龙江省和吉林市，东 濒太平洋，陆地面积约960万平方公里。",
  "additional_kwargs=": {
    "refusal": null
  },
  "response_metadata=": {
    "token_usage": {
      //大模型输出消耗的token
      "completion_tokens": 40,
      //输入消耗的token
      "prompt_tokens": 18,
      "total_tokens": 58,
      "completion_tokens_details": null,
      "prompt_tokens_details": null
    },
    "model_provider": "openai",
    // 实际调用的模型版本
    "model_name": "qwen:4b",
    "system_fingerprint": "fp_ollama",
    // 模型侧的请求唯一 ID
    "id": "chatcmpl-411",
    "finish_reason": "stop",
    "logprobs": null
  },
  // LangChain 运行 ID
  "id=": "lc_run--019b2cd3-72d1-7593-8daf-65b18479fd98-0",
  "usage_metadata=": {
    "input_tokens": 18,
    "output_tokens": 40,
    "total_tokens": 58,
    "input_token_details": {},
    "output_token_details": {}
  }
}

content：模型生成的回复文本

finish_reason：模型停止生成的原因
    - stop：正常完成（无需处理）；
    - length：token 数达到上限（回复被截断，需优化提示词 / 调高 token 上限）；
    - error：生成失败（需排查模型调用参数 / 网络）；
    - function_call：触发了函数调用（非预期则需调整提示词）；
    - 其他值（如refusal）：模型拒绝回答（提示词违规）。

refusal: 内容合规排查
    仅当模型拒绝回答时有用（比如提示词涉敏，refusal会返回拒绝理由），正常回复时为null，无需关注。

LangChain 运行 ID
    仅当使用 LangChain 复杂链（Chain/Agent）时，用于追踪 LangChain 内部执行流程
```

<font style="color:rgb(15, 17, 21);">ChatPromptTemplate.from_messages()</font><font style="color:rgb(15, 17, 21);"> 接受两种格式：</font>

```json
# 方式1：元组格式（模板）
("human", "{input}")              # 等待填充
("ai", "{response}")             # 等待填充
("system", "{instruction}")      # 等待填充

# 方式2：消息实例（固定内容）
HumanMessage(content="固定内容")   # 内容已固定
AIMessage(content="固定回复")      # 内容已固定
SystemMessage(content="固定指令")  # 内容已固定
```

## 结构化输出

**<font style="color:rgb(0, 0, 0);">提示词指定 JSON 格式</font>**

<font style="color:rgba(0, 0, 0, 0.85);">直接在 Prompt 中要求模型输出 JSON，适合对格式要求不高的场景</font>

```python
from langchain_core.prompts import ChatPromptTemplate
from test1 import llm
import json

prompt_template = ChatPromptTemplate.from_template(
    """
    请用JSON格式介绍{topic}，要求包含以下字段：
        - name: 名称（字符串）
        - area: 面积（字符串，带单位）
        - location: 地理位置（字符串）
        - language: 官方语言（字符串）

    注意：仅输出JSON，不要添加任何额外解释文字！
    """
)

messages = prompt_template.format_messages(topic="中国")
resp = llm.invoke(messages)
print(resp.content)
print(type(resp.content))
structured_data = json.loads(resp.content.replace("```json","").replace("```",""))
print(f"名称：{structured_data['name']}")
print(f"面积：{structured_data['area']}")
print(f"地理位置：{structured_data['location']}")
print(f"官方语言：{structured_data['language']}")
```

<!-- 这是一张图片，ocr 内容为： -->

![](https://cdn.nlark.com/yuque/0/2025/png/32623986/1765986778737-787b9cd3-a0e6-47bd-a201-b45ea1ac5bf8.png)

**<font style="color:rgb(0, 0, 0);">缺点：</font>**

+ <font style="color:rgb(0, 0, 0);">模型可能输出额外文字（如 “以下是 JSON 格式的介绍：”），导致解析失败；</font>
+ <font style="color:rgb(0, 0, 0);">无格式验证，字段缺失 / 类型错误时无法自动修正。</font>

**<font style="color:rgb(0, 0, 0);">Pydantic 结构化输出</font>**

<font style="color:rgba(0, 0, 0, 0.85);">LangChain 推荐使用 </font>**<font style="color:rgb(0, 0, 0) !important;">Pydantic 模型</font>**<font style="color:rgba(0, 0, 0, 0.85);"> 定义结构化输出的 schema，结合 StructuredOutputParser 实现「格式约束 + 自动验证 + 解析」，是生产环境的首选方式。</font>

```python
from pydantic import BaseModel, Field
from langchain_core.output_parsers.pydantic import PydanticOutputParser
from langchain_core.prompts import ChatPromptTemplate
from test1 import llm


# 定义Pydantic模型（结构化输出的schema）
class CountryInfo(BaseModel):
    name: str = Field(description="国家名称")
    area: str = Field(description="国家面积")
    location: str = Field(description="国家地理位置")
    language: str = Field(description="国家官方语言")


# 创建结构化输出解析器
parstr = PydanticOutputParser[CountryInfo](pydantic_object=CountryInfo)

# 定义Prompt
prompt = ChatPromptTemplate.from_template(
    """
    请介绍{topic}，并严格按照以下格式输出：
    {format_instructions}

    注意：必须符合指定格式，不要添加额外内容！
    """
)

# 格式化Prompt
messages = prompt.format_messages(
    topic="澳大利亚",
    format_instructions=parstr.get_format_instructions(),  # # 自动生成JSON格式说明
)

response = llm.invoke(messages)
print(response.content)
try:
    structured_data = parstr.parse(response.content)
    print("结构化输出（Pydantic对象）：")
    print(f"名称：{structured_data.name}")
    print(f"面积：{structured_data.area}")
    # 可直接转换为字典
    print("转换为字典：", structured_data.model_dump())
except Exception as e:
    print(f"解析失败：{e}")
```

**<font style="color:rgb(0, 0, 0);">关键说明：</font>**

+ <font style="color:rgb(0, 0, 0);">Pydantic BaseModel </font><font style="color:rgb(0, 0, 0);">：通过 </font><font style="color:rgb(0, 0, 0);">Field(description)</font><font style="color:rgb(0, 0, 0);"> 定义字段含义，LangChain 会自动将这些描述注入到 Prompt 中，让模型更理解字段要求；</font>
+ <font style="color:rgb(0, 0, 0);">parser.get_format_instructions() </font><font style="color:rgb(0, 0, 0);">：自动生成格式说明（如 “输出 JSON，字段包括 name/area/...，类型分别为 string/string/...”），无需手动写 Prompt；</font>
+ <font style="color:rgb(0, 0, 0);">自动验证：若模型输出的字段缺失 / 类型错误（如 area 是数字而非字符串），解析时会抛出异常，方便捕获并处理。</font>

**<font style="color:rgb(0, 0, 0);">使用 JSON 模式</font>**

<font style="color:rgb(31, 35, 41);">定义JSON Schema（输出规则） → 初始化解析器 → 定义提示词模板 → 填充变量生成标准消息 → 调用LLM → 得到模型回复</font>

```python
from test1 import llm
from langchain_core.output_parsers.json import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
import json


# 定义JSON Schema（字段约束）
json_schema = {
    "type": "object",  # 要求模型输出的 JSON 是一个对象（对应 Python 字典）
    "properties": {
        "name": {"type": "string", "description": "国家名称"},
        "area": {"type": "string", "description": "国土面积（带单位）"},
        "location": {"type": "string", "description": "地理位置"},
        "language": {"type": "string", "description": "官方语言"},
    },
    "required": ["name", "area", "location", "language"],  # 指定必选字段，模型输出的 JSON 必须包含这 4 个字段，缺一不可
}

# 创建JSON解析器
parser = JsonOutputParser()

# 定义Prompt（明确Schema要求）
prompt = ChatPromptTemplate.from_template(
    """
请严格按照以下JSON Schema输出{topic}的信息，仅返回JSON字符串，无其他内容：
Schema: {schema}
"""
)


messages = prompt.format_messages(
    # 指定 JSON 字符串的缩进为 2 个空格，让输出的 JSON 更易读,indent="\t"：用制表符缩进
    topic="中国",
    schema=json.dumps(json_schema, indent=2),
)


response = llm.invoke(messages)
print(response)
print(type(response.content))
structured_data = parser.parse(response.content)
print("JSON Schema结构化输出：", structured_data)
```

<!-- 这是一张图片，ocr 内容为： -->

![](https://cdn.nlark.com/yuque/0/2025/png/32623986/1766046616267-a2ccaa18-012d-498a-94b0-6990d9d1a51b.png)

| **<font style="color:rgb(0, 0, 0) !important;">工具类</font>**     | **<font style="color:rgb(0, 0, 0) !important;">作用</font>**                                     | **<font style="color:rgb(0, 0, 0) !important;">适用场景</font>**               |
|:--------------------------------------------------------------- |:---------------------------------------------------------------------------------------------- |:-------------------------------------------------------------------------- |
| <font style="color:rgb(0, 0, 0);">JsonOutputParser</font>       | <font style="color:rgba(0, 0, 0, 0.85) !important;">解析 JSON 字符串为字典，无前置 schema 验证</font>        | <font style="color:rgba(0, 0, 0, 0.85) !important;">简单场景，仅需 JSON 格式</font> |
| <font style="color:rgb(0, 0, 0);">PydanticOutputParser</font>   | <font style="color:rgba(0, 0, 0, 0.85) !important;">基于 Pydantic 模型验证 + 解析，支持字段类型 / 必选约束</font> | <font style="color:rgba(0, 0, 0, 0.85) !important;">生产环境，需要严格格式验证</font>   |
| <font style="color:rgb(0, 0, 0);">StructuredOutputParser</font> | <font style="color:rgba(0, 0, 0, 0.85) !important;">（旧版）类似 PydanticOutputParser</font>         |                                                                            |

****

**with_structured_output**

```python
from pydantic import BaseModel, Field
from langchain_core.output_parsers.pydantic import PydanticOutputParser
from langchain_core.prompts import ChatPromptTemplate
from test1 import llm


# 定义Pydantic模型（结构化输出的schema）
class CountryInfo(BaseModel):
    name: str = Field(description="国家名称")
    area: str = Field(description="国家面积")
    location: str = Field(description="国家地理位置")
    language: str = Field(description="国家官方语言")


# 定义Prompt
prompt = ChatPromptTemplate.from_template(
    """
    请介绍{topic}，并严格按照以下格式输出：

    注意：必须符合指定格式，不要添加额外内容！
    """
)

# 格式化Prompt
messages = prompt.format_messages(
    topic="澳大利亚",
)

response = llm.with_structured_output(CountryInfo).invoke(messages)
print(response)
print(type(response))  # <class '__main__.CountryInfo'>
```

<!-- 这是一张图片，ocr 内容为： -->

![](https://cdn.nlark.com/yuque/0/2025/png/32623986/1766050678576-8a1d8b7c-8465-4be2-a666-2406d2548097.png)

**SimpleJsonOutputParser**

<font style="color:rgb(17, 17, 51);">用于</font>**<font style="color:rgb(17, 17, 51);">从 LLM 的纯文本响应中提取并解析 JSON 内容</font>**<font style="color:rgb(17, 17, 51);">。</font>

**<font style="color:rgb(17, 17, 51);">适用场景:</font>**

+ <font style="color:rgb(17, 17, 51);">模型返回的是</font>**<font style="color:rgb(17, 17, 51);">包含 JSON 的普通文本</font>**
+ <font style="color:rgb(17, 17, 51);">你想避免复杂的 Pydantic schema 或 tool calling</font>
+ <font style="color:rgb(17, 17, 51);">使用的是不支持  .with_structured_output() 的旧模型</font>

```python
from pydantic import BaseModel, Field
from langchain_core.prompts import ChatPromptTemplate
from test1 import llm
from langchain_core.output_parsers import SimpleJsonOutputParser


# 定义Pydantic模型（结构化输出的schema）
class CountryInfo(BaseModel):
    name: str = Field(description="国家名称")
    area: str = Field(description="国家面积")
    location: str = Field(description="国家地理位置")
    language: str = Field(description="国家官方语言")


# 创建结构化输出解析器
parstr = SimpleJsonOutputParser()



# 定义Prompt
prompt = ChatPromptTemplate.from_template(
    """
    请介绍{topic}，并严格按照以下格式输出：

    注意：必须符合指定格式，不要添加额外内容！
    """
)

# 格式化Prompt
messages = prompt.format_messages(
    topic="澳大利亚"
)

chain= prompt | llm | parstr

response = llm.invoke(messages)
print(response)
print(type(response))
```

<!-- 这是一张图片，ocr 内容为： -->

![](https://cdn.nlark.com/yuque/0/2025/png/32623986/1766051833650-5a905c21-1297-42da-870f-66dfadcd9b1a.png)

```python
print(response.content)
```

<!-- 这是一张图片，ocr 内容为： -->

![](https://cdn.nlark.com/yuque/0/2025/png/32623986/1766052203109-ba527223-6f37-48c1-a466-0951ac8d180b.png)

```python
# 定义Prompt
prompt = ChatPromptTemplate.from_template(
    """
    请介绍{topic}，并严格按照以下格式输出：
        JSON格式
    注意：必须符合指定格式，不要添加额外内容！
    """
)



print(response.content)
print(type(response.content))
```

<!-- 这是一张图片，ocr 内容为： -->

![](https://cdn.nlark.com/yuque/0/2025/png/32623986/1766052381597-d2b00197-9a2b-49b5-b74e-4695274a4120.png)

```python
from langchain_core.runnables import RunnableRetry

retry_chain = (
    prompt 
    | llm.bind(stop=["\n\n"])  # 减少多余文本
    | parser
).with_retry(stop_after_attempt=3)

result = retry_chain.invoke({"input": "Alice, 30"})
```

**工具调用**

原理是首先将所需的模式直接或通过 LangChain 工具绑定到聊天模型，使用 .bind_tools() 方法。然后模型将生成一个包含与所需形状匹配的 args 的 tool_calls 字段的 AIMessage。工具调用是一种通常一致的方法，可以让模型生成结构化输出，并且是默认技术用于with_structured_output方法

```python
from pydantic import BaseModel, Field
from langchain_core.prompts import ChatPromptTemplate
from test1 import llm
from langchain_core.output_parsers import SimpleJsonOutputParser


# 定义Pydantic模型（结构化输出的schema）
class CountryInfo(BaseModel):
    """始终使用此工具来结构化你的用户响应"""
    name: str = Field(description="国家名称")
    area: str = Field(description="国家面积")
    location: str = Field(description="国家地理位置")
    language: str = Field(description="国家官方语言")

# 定义Prompt
prompt = ChatPromptTemplate.from_template(
    """
    请介绍{topic}，并严格按照格式输出：
    注意：不要添加额外内容！
    """
)

# 格式化Prompt
messages = prompt.format_messages(
    topic="澳大利亚",
)

chain= prompt | llm.bind_tools([CountryInfo]) 

response = chain.invoke(messages)
print(response)
print("-------------------")
# print(response.tool_calls)
print(type(response))
```

<!-- 这是一张图片，ocr 内容为： -->

![](https://cdn.nlark.com/yuque/0/2025/png/32623986/1766060510032-6f7c6bab-c037-4803-8794-623fb5bbf5d0.png)

```json
content='' additional_kwargs={'refusal': None} response_metadata={'token_usage': {'completion_tokens': 57, 'prompt_tokens': 273, 'total_tokens': 330, 'completion_tokens_details': None, 'prompt_tokens_details': {'audio_tokens': None, 'cached_tokens': 0}}, 'model_provider': 'openai', 'model_name': 'qwen-plus', 'system_fingerprint': None, 'id': 'chatcmpl-ff6da765-bc12-460c-aaff-ba5e5b265741', 'finish_reason': 'tool_calls', 'logprobs': None} id='lc_run--019b3165-b9e5-78c3-bdb5-e00f3f552101-0' 

tool_calls=[{'name': 'CountryInfo', 'args': {'name': '澳大利亚', 'area': '7692024平方公里', 'location': '南半球，位于太平洋和印度洋之间，属于大洋洲', 'language': '英语'}, 'id': 'call_8b706a4ef07d4349afa9e0', 'type': 'tool_call'}]

usage_metadata={'input_tokens': 273, 'output_tokens': 57, 'total_tokens': 330, 'input_token_details': {'cache_read': 0}, 'output_token_details': {}}
```

**其他**

```python
from test1 import llm
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_template(
    "将以下内容翻译成{target_language}: {text}"
)

# 创建解析器
output_parser = StrOutputParser()

# 构建链：提示模板 → LLM → 输出解析器
chain = prompt | llm | output_parser

# # 方式1：直接调用
# result1 = chain.invoke({
#     "target_language": "英文",
#     "text": "你好，我是一个中国人"
# })
# print(result1)



# # 方式2：分步执行查看中间结果
# chain_with_intermediate = prompt | llm
# intermediate_result = chain_with_intermediate.invoke({
#     "target_language": "日文", 
#     "text": "人工智能改变世界"
# })
# print("中间结果类型:", type(intermediate_result)) # 中间结果类型: <class 'langchain_core.messages.ai.AIMessage'>
# print("中间结果内容:", intermediate_result.content)

# 批量翻译多个文本
texts = [
    {"target_language": "法文", "text": "我爱编程"},
    {"target_language": "德文", "text": "学习使我快乐"},
    {"target_language": "西班牙文", "text": "科技推动进步"}
]

# 批量翻译
results = chain.batch(texts)
for result in results:
    print(result)
    print("------------")
```

## <font style="color:rgb(15, 17, 21);">消息</font>

```python
message = [
    SystemMessage(content="你是一个专业的问答助手"),  # 系统角色设定
    HumanMessage(content="早上好"),                    # 用户输入
    AIMessage(content="不好，今天天气重度污染")        # AI回复
]
```

**<font style="color:rgb(15, 17, 21);">SystemMessage - 系统消息</font>**

+ **<font style="color:rgb(15, 17, 21);">作用</font>**<font style="color:rgb(15, 17, 21);">：设置AI的角色、行为规范、对话风格</font>

```python
# 设定角色
SystemMessage(content="你是一个专业的法律顾问")

# 设定行为规范  
SystemMessage(content="请用中文回答，保持简洁明了")

# 设定格式要求
SystemMessage(content="请用markdown格式回答问题")
```

+ **<font style="color:rgb(15, 17, 21);">特点</font>**<font style="color:rgb(15, 17, 21);">：</font>
  - <font style="color:rgb(15, 17, 21);">不会被直接"回复"，而是影响后续所有对话</font>
  - <font style="color:rgb(15, 17, 21);">可以为空，但一般建议设置明确的角色</font>

**<font style="color:rgb(15, 17, 21);">HumanMessage - 人类消息</font>**

+ **<font style="color:rgb(15, 17, 21);">作用</font>**<font style="color:rgb(15, 17, 21);">：代表用户的输入/问题</font>

```python
# 带角色名的消息
HumanMessage(content="早上好", name="张三")

# 多模态输入（图片、文件等）
HumanMessage(content=[
    {"type": "text", "text": "分析这张图片"},
    {"type": "image_url", "image_url": {"url": "https://..."}}
])
```

+ **<font style="color:rgb(15, 17, 21);">特点</font>**<font style="color:rgb(15, 17, 21);">：</font>
  - <font style="color:rgb(15, 17, 21);">可以有多条（表示多轮对话）</font>
  - <font style="color:rgb(15, 17, 21);">可以是纯文本，也可以是复杂格式</font>

**<font style="color:rgb(15, 17, 21);">AIMessage - AI消息</font>**

+ **<font style="color:rgb(15, 17, 21);">作用</font>**<font style="color:rgb(15, 17, 21);">：代表AI的回复/输出</font>

```python
# 带思考链的回复
AIMessage(
    content="最终答案是42",
    additional_kwargs={
        "reasoning": "先计算A...然后B...最后得出42"
    }
)
```

+ **<font style="color:rgb(15, 17, 21);">特点</font>**<font style="color:rgb(15, 17, 21);">：</font>
  - <font style="color:rgb(15, 17, 21);">可以包含工具调用信息</font>
  - <font style="color:rgb(15, 17, 21);">可以包含思考过程</font>

**<font style="color:rgb(15, 17, 21);">持续对话：</font>**

```python
# 持续对话示例
messages = [SystemMessage(content="你是一个幽默的聊天机器人")]

# 开始持续对话循环
print("\n开始持续对话！输入'退出'结束对话。")
while True:
    # 获取用户输入
    user_input = input("你: ")

    # 检查是否退出
    if user_input.strip() == "退出":
        print("对话结束，再见！")
        break

    # 添加用户消息到对话历史
    messages.append(HumanMessage(content=user_input))

    # 调用模型
    response = llm.invoke(messages)

    # 打印模型响应
    print(f"AI: {response.content}")

    # 将模型响应添加到对话历史，用于下一次对话的上下文
    messages.append(AIMessage(content=response.content))
```

## 短期记忆
