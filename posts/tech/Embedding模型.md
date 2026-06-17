## 

---

title: 什么是Embedding模型

date: 2026-06-16

tags: [架构师, 学习路线, 后端]

category: 技术笔记

---

## 什么是Embedding模型

Embedding 模型（嵌入模型）是自然语言处理（NLP）和人工智能中的核心技术之一，它的作用是将离散的符号（如单词、句子、图像、用户ID等），从而让计算机能够“理解”并计算它们之间的语义相似性。

假如有一个xy轴

**🌰**** 举个简单例子**

**假设我们有三个词：“猫”、“狗”、“汽车”**

**通过一个 Embedding 模型，它们会被转换成向量（一串数字）：**

```python
"猫" → [0.8, -0.3, 0.5, ..., 0.1]   # 768维向量
"狗" → [0.75, -0.25, 0.48, ..., 0.08]
"汽车" → [-0.1, 0.9, -0.6, ..., -0.3]
```

+ “猫” 和 “狗” 的向量在空间中距离很近（因为都是宠物、哺乳动物）；
+ “猫” 和 “汽车” 的向量距离很远。

语义越相近，向量距离越小（通常用余弦相似度或欧氏距离衡量）。

**🔑**** Embedding 模型的核心特点**

| <font style="color:rgb(17, 17, 51);">场景</font>                                                          | <font style="color:rgb(17, 17, 51);">说明</font>                                   |
| ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **<font style="color:rgb(17, 17, 51);">语义搜索</font>**                                                    | <font style="color:rgb(17, 17, 51);">用户搜“如何煮咖啡”，系统返回“咖啡制作方法”而非仅含“咖啡”字样的文档</font> |
| **<font style="color:rgb(17, 17, 51);">推荐系统</font>**                                                    | <font style="color:rgb(17, 17, 51);">将用户行为和商品都转为向量，找最相似的商品推荐</font>              |
| **<font style="color:rgb(17, 17, 51);">聚类分析</font>**                                                    | <font style="color:rgb(17, 17, 51);">自动将相似评论归为一类（如“好评”、“物流慢”）</font>             |
| **<font style="color:rgb(17, 17, 51);">RAG</font>**<font style="color:rgb(17, 17, 51);">（检索增强生成）</font> | <font style="color:rgb(17, 17, 51);">先用 embedding 检索相关知识片段，再让 LLM 生成答案</font>    |
| **<font style="color:rgb(17, 17, 51);">去重/相似检测</font>**                                                 | <font style="color:rgb(17, 17, 51);">判断两段话是否表达相同意思</font>                        |

**🛠**** 常见应用场景**

| <font style="color:rgb(17, 17, 51);">场景</font>                                                          | <font style="color:rgb(17, 17, 51);">说明</font>                                   |
| ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **<font style="color:rgb(17, 17, 51);">语义搜索</font>**                                                    | <font style="color:rgb(17, 17, 51);">用户搜“如何煮咖啡”，系统返回“咖啡制作方法”而非仅含“咖啡”字样的文档</font> |
| **<font style="color:rgb(17, 17, 51);">推荐系统</font>**                                                    | <font style="color:rgb(17, 17, 51);">将用户行为和商品都转为向量，找最相似的商品推荐</font>              |
| **<font style="color:rgb(17, 17, 51);">聚类分析</font>**                                                    | <font style="color:rgb(17, 17, 51);">自动将相似评论归为一类（如“好评”、“物流慢”）</font>             |
| **<font style="color:rgb(17, 17, 51);">RAG</font>**<font style="color:rgb(17, 17, 51);">（检索增强生成）</font> | <font style="color:rgb(17, 17, 51);">先用 embedding 检索相关知识片段，再让 LLM 生成答案</font>    |
| **<font style="color:rgb(17, 17, 51);">去重/相似检测</font>**                                                 | <font style="color:rgb(17, 17, 51);">判断两段话是否表达相同意思</font>                        |
| **<font style="color:rgb(15, 17, 21);">文本分类</font>**                                                    | <font style="color:rgb(15, 17, 21);">将文本向量作为特征输入分类器</font>                       |
| **<font style="color:rgb(15, 17, 21);">异常检测</font>**                                                    | <font style="color:rgb(15, 17, 21);">识别与其他向量差异大的样本</font>                        |

**<font style="color:rgb(17, 17, 51);">One-Hot 与 Embedding 核心对比</font>**

```python
# 假设词表有 10,000 个词，“猫”可能是：
[0, 0, 0, ..., 1, ..., 0]  ← 第 3276 位是 1，其余是 0

维度爆炸：10 万个词 → 向量长度 10 万
稀疏浪费：99.99% 是 0，存储和计算效率极低

🧠就像给每个学生发一个超长名单，只在自己名字下打勾 —— 老师无法知道谁和谁是好朋友。
```

| <font style="color:rgb(17, 17, 51);">特性</font>          | <font style="color:rgb(17, 17, 51);">One-Hot 编码</font>                                                         | <font style="color:rgb(17, 17, 51);">Embedding</font>                                                |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **<font style="color:rgb(17, 17, 51);">向量维度</font>**    | <font style="color:rgb(17, 17, 51);">高维（= 词汇表大小，可能数十万）</font>                                                  | <font style="color:rgb(17, 17, 51);">低维（通常 50~1024）</font>                                           |
| **<font style="color:rgb(17, 17, 51);">稀疏性</font>**     | <font style="color:rgb(17, 17, 51);">极度稀疏（只有一个 1）</font>                                                       | <font style="color:rgb(17, 17, 51);">稠密（所有值都非零）</font>                                               |
| **<font style="color:rgb(17, 17, 51);">语义信息</font>**    | <font style="color:rgb(17, 17, 51);">❌</font><font style="color:rgb(17, 17, 51);"> 完全没有（“猫”和“狗”正交，距离相同）</font> | <font style="color:rgb(17, 17, 51);">✅</font><font style="color:rgb(17, 17, 51);"> 有（相似词向量接近）</font> |
| **<font style="color:rgb(17, 17, 51);">存储/计算效率</font>** | <font style="color:rgb(17, 17, 51);">低（浪费内存，矩阵运算慢）</font>                                                      | <font style="color:rgb(17, 17, 51);">高（适合 GPU 加速）</font>                                             |
| **<font style="color:rgb(17, 17, 51);">可学习性</font>**    | <font style="color:rgb(17, 17, 51);">固定编码，不可训练</font>                                                          | <font style="color:rgb(17, 17, 51);">可作为模型参数端到端训练</font>                                             |
| **<font style="color:rgb(17, 17, 51);">泛化能力</font>**    | <font style="color:rgb(17, 17, 51);">无法处理未登录词（OOV）</font>                                                      | <font style="color:rgb(17, 17, 51);">可通过子词（如 BPE）或上下文处理新词</font>                                     |

| <font style="color:rgb(17, 17, 51);">场景</font>                        | <font style="color:rgb(17, 17, 51);">推荐方法</font>                                                                                                                                                              |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <font style="color:rgb(17, 17, 51);">传统 ML（如决策树、线性模型）</font>          | <font style="color:rgb(17, 17, 51);">One-Hot（配合特征工程）</font>                                                                                                                                                   |
| <font style="color:rgb(17, 17, 51);">深度学习 NLP（RNN、Transformer）</font> | <font style="color:rgb(17, 17, 51);">Embedding（必须）</font>                                                                                                                                                     |
| <font style="color:rgb(17, 17, 51);">语义搜索、相似度计算</font>                | <font style="color:rgb(17, 17, 51);">Embedding（唯一选择）</font>                                                                                                                                                   |
| <font style="color:rgb(17, 17, 51);">小型分类任务、类别不多</font>               | <font style="color:rgb(17, 17, 51);">One-Hot 也可用</font>                                                                                                                                                       |
| <font style="color:rgb(17, 17, 51);">大词汇表、需语义理解</font>                | <font style="color:rgb(17, 17, 51);">❌</font><font style="color:rgb(17, 17, 51);"> 不要用 One-Hot，</font><font style="color:rgb(17, 17, 51);">✅</font><font style="color:rgb(17, 17, 51);"> 必须用 Embedding</font> |

## <font style="color:rgb(17, 17, 51);">如何衡量两个 Embedding 的相似度？</font>

<font style="color:rgb(17, 17, 51);">常用两种距离：</font>

<!-- 这是一张图片，ocr 内容为： -->

![](https://cdn.nlark.com/yuque/0/2025/png/32623986/1766479724711-53ed6669-5389-4d3e-8805-c9bf6385b4ba.png)

```python
如果 embedding 已经 L2 归一化（长度=1），则
余弦相似度 = 点积，
余弦距离 = 1 - 点积
```

## langchain的文本嵌入模型(Embeddings)

<font style="color:rgb(17, 17, 51);">LangChain 中的 </font>**<font style="color:rgb(17, 17, 51);">文本嵌入模型</font>**<font style="color:rgb(17, 17, 51);">（Embeddings）是用于将文本（如单词、句子、文档）转换为</font>**<font style="color:rgb(17, 17, 51);">稠密向量表示</font>**<font style="color:rgb(17, 17, 51);">（embeddings）的核心组件。这些向量可用于语义搜索、相似度计算、聚类、RAG（检索增强生成）等任务。</font>

**常见 Embedding 模型集成**

✅** OpenAI Embeddings**

```python
from openai import OpenAI
from base_set import LOCAL_BASE_URL, MODEL_NAME, MODEL_KEY

embedding_llm = OpenAI(
    api_key=MODEL_KEY,
    base_url=LOCAL_BASE_URL,
)

# dimensions=768  # 维度值 [64, 128, 256, 512, 768, 1024, 1536, 2048, 3072]
texts = ["猫", "狗", "房子", "故宫", "中国"]
embedding = embedding_llm.embeddings.create(model=MODEL_NAME, input=texts, dimensions=1024)
print(embedding)

# 获取嵌入向量
embedding_vector = response['data'][0]['embedding']
```

```python
CreateEmbeddingResponse(data=[Embedding(embedding=[0.031400006264448166, -0.002531724749132991,-0.0183150302618742，。。。。。], index=4, object='embedding')], model='text-embedding-v4', object='list', usage=Usage(prompt_tokens=10, total_tokens=10), id='16a1ef8c-cbc4-480b-914f-628f4d582859')



id: 本次请求的唯一标识符，用于追踪和日志记录
object: 响应类型，固定为 'list' 表示返回的是列表结构
model: 使用的嵌入模型名称，这里是 'text-embedding-v4'
usage: 令牌使用统计
    prompt_tokens: 输入文本消耗的令牌数（这里是10个）
    total_tokens: 总令牌数（与prompt_tokens相同，因为嵌入模型不生成新文本）
data：这是一个列表，包含一个或多个Embedding对象
    embedding: 实际的嵌入向量数组
        这是一个高维浮点数数组（示例中只显示前3个值，实际有数百到数千维）
        每个维度代表文本在某个语义特征上的数值表示
        可用于相似性计算、聚类等任务
    index: 在输入批次中的索引位置（从0开始）
        如果一次性提交多个文本，这个索引标识每个文本的结果
    object: 对象类型，固定为 'embedding'
```

## **<font style="color:rgb(17, 17, 51);">基于 Embedding 的语义搜索</font>**

读取文件内容数据处理，然后将指定文本向量化 → 存储到 CSV → 输入一个查询词（如“中国”）→ 计算余弦距离 → 返回最相似的 top-k 地址。

```python
读取文件内容数据处理，然后将指定文本向量化
→ 
存储到 CSV
→ 
输入一个查询词，计算余弦距离 ，返回最相似的
```

```python
import pandas as pd
from test1 import embedding_llm
from base_set import MODEL_NAME
from scipy.spatial.distance import cosine
import ast
import numpy as np


def text_embeding(text):
    """
    对文本进行向量化。
    """
    return (
        embedding_llm.embeddings.create(model=MODEL_NAME, input=text, dimensions=1024)
        .data[0]
        .embedding
    )

# 数据处理
def data_file(source_file, output_file):
    """
    处理数据文件，向量化地址并保存到新文件。
    """
    # 准备数据
    df = pd.read_csv(source_file, encoding="gbk")
    df = df[["Type", "Name", "Address", "Level", "Label and Num", "District", "Area"]]
    # 合并数据
    df["NAddress"] = df["Name"] + df["District"].str.strip() + df["Area"].str.strip()
    # 向量化 df["NAddress"] 逐一向量化，CSV 无法直接存储 list/array，所以 df["Embedding"] 实际存的是 字符串
    df["Embedding"] = df["NAddress"].apply(lambda x: text_embeding(x))
    df.to_csv(output_file, index=False, encoding="gbk")


def my_cosine_distance(vec1, vec2):
    """
    计算两个向量之间的余弦距离。
    """
    # cosine自动转为 array  [vec1][vec2]
    return cosine(vec1, vec2)


def sreach_input(input_text, out_file, top=3):
    """
    搜索输入文本在数据框中最相似的地址。
    """
    df = pd.read_csv(out_file, encoding="gbk")
    # ast.literal_eval 转为 list
    df["Embedding_vec"] = df["Embedding"].apply(lambda x: ast.literal_eval(x))
    input_embedding = text_embeding(input_text)
    df["similarity"] = df["Embedding_vec"].apply(
        lambda x: my_cosine_distance(input_embedding, x)
    )
    for index, row in df["similarity"].sort_values(ascending=True).head(top).items():
        print(row)       # 打印余弦距离
        # print(df.iloc[index])  # 打印原始行数据


if __name__ == '__main__':
    # data_file('测试\Embedding_demo\datas\data.csv', '测试\Embedding_demo\datas\output_embedding.csv')
    sreach_input('鲍鱼', '测试\Embedding_demo\datas\output_embedding.csv')
```

存在问题：

**<font style="color:rgb(17, 17, 51);">CSV 无法直接存储 list/array</font>**<font style="color:rgb(17, 17, 51);">，所以 df["Embedding"] 实际存的是 </font>**<font style="color:rgb(17, 17, 51);">字符串</font>**<font style="color:rgb(17, 17, 51);">，后续读取时必须用 ast.literal_eval 转回 list，</font>**<font style="color:rgb(17, 17, 51);">效率低且易出错</font>**<font style="color:rgb(17, 17, 51);">（如果字符串格式不对就崩溃）。</font>

**<font style="color:rgb(17, 17, 51);">性能极差</font>**<font style="color:rgb(17, 17, 51);">：对每条数据单独计算余弦距离（O(n) 次函数调用），n 大时很慢。（暂不处理）</font>

**<font style="color:rgb(17, 17, 51);">重复 API 调用</font>**<font style="color:rgb(17, 17, 51);">：每次搜索都要调一次 text_embeding(input_text) ，可接受，但若频繁调用应缓存。（暂不处理）。</font>

**<font style="color:rgb(17, 17, 51);">未处理异常</font>**<font style="color:rgb(17, 17, 51);">：如果某行 Embedding 字符串非法，ast.literal_eval 会抛 ValueError。</font>

改进：

```python
df.to_csv 改 df.to_parquet(output_file, index=False)

data_file('测试\Embedding_demo\datas\data.csv', '测试\Embedding_demo\datas\output_embedding.parquet')

df = pd.read_parquet(out_file)
sreach_input(
        "阿一鲍鱼(总店)越秀区区庄/动物园",
        "测试\Embedding_demo\datas\output_embedding.parquet",
    )
```

## 向量库

**Chroma**

**<font style="color:rgb(17, 17, 51);">Chroma</font>**<font style="color:rgb(17, 17, 51);"> 是一个专为 </font>**<font style="color:rgb(17, 17, 51);">AI 应用（尤其是 LLM + RAG）</font>**<font style="color:rgb(17, 17, 51);"> 设计的轻量级、开源向量数据库。它的核心理念是：</font>**<font style="color:rgb(17, 17, 51);">“让向量检索像使用字典一样简单”</font>**<font style="color:rgb(17, 17, 51);">。</font>**<font style="color:rgb(17, 17, 51);">Chroma</font>**<font style="color:rgb(17, 17, 51);"> = RAG 开发者的瑞士军刀：小而美，快而稳。</font>

**<font style="color:rgb(17, 17, 51);">核心优势：</font>**

+ **<font style="color:rgb(17, 17, 51);">极简 API：</font>**
+ **<font style="color:rgb(17, 17, 51);">自动持久化</font>**<font style="color:rgb(17, 17, 51);">：默认使用 SQLite</font>
+ <font style="color:rgb(17, 17, 51);">原生支持 </font>**<font style="color:rgb(17, 17, 51);">Document + Metadata</font>**
+ <font style="color:rgb(17, 17, 51);">与 </font>**<font style="color:rgb(17, 17, 51);">LangChain</font>**<font style="color:rgb(17, 17, 51);"> / LlamaIndex </font>**<font style="color:rgb(17, 17, 51);">无缝集成</font>**

**局限性：**

+ <font style="color:rgb(17, 17, 51);">不适合 > 100 万向量的场景</font>
+ <font style="color:rgb(17, 17, 51);">无分布式/高可用</font>
+ <font style="color:rgb(17, 17, 51);">过滤能力较弱（仅支持简单等值/范围查询）</font>

**“如果你在用 LangChain 做 RAG，Chroma 是最省心的选择。”**

**与 LangChain 深度集成**

```python
pip install chromadb   
pip install langchain_chroma
pip install langchain_huggingface 
```

```python
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma


model_embed = HuggingFaceEmbeddings(
    model_name=r"D:\Ai\model\BAAI\bge-base-zh-v1-5",
    model_kwargs={"device": "cpu"},
    encode_kwargs={"normalize_embeddings": True},  # 必须开启！
)

"""
    构建向量库 
    功能：创建包含两个文档的Chroma向量数据库
    """
vectorstore = Chroma.from_texts(
    texts=["北京故宫", "上海外滩"],
    embedding=model_embed,
    persist_directory="./chroma_db",
)

result = vectorstore.similarity_search("中国著名景点", k=1)
print(result)


1. 加载中文嵌入模型（BGE模型）
2. 将"北京故宫"和"上海外滩"转换为向量
3. 创建Chroma数据库并存储这些向量
4. 将查询"中国著名景点"转换为向量
5. 找出与查询向量最相似的文档向量
6. 返回最相似的结果


    # 后续可以重新加载数据库
    vectorstore_loaded = Chroma(
        persist_directory="./chroma_db", embedding_function=model_embed
    )
    result = vectorstore_loaded.similarity_search("北京", k=1)
    print(result)
```

<font style="color:rgb(15, 17, 21);">参数解释：</font>

+ **<font style="color:rgb(15, 17, 21);">model_name</font>**<font style="color:rgb(15, 17, 21);">: 本地模型路径（BAAI/bge-base-zh-v1-5是智源研究院的中文嵌入模型）</font>
+ **<font style="color:rgb(15, 17, 21);">model_kwargs={"device": "cpu"}</font>**<font style="color:rgb(15, 17, 21);">: 指定在CPU上运行（改为"cuda"可使用GPU）</font>
+ **<font style="color:rgb(15, 17, 21);">encode_kwargs={"normalize_embeddings": True}</font>**<font style="color:rgb(15, 17, 21);">:</font>
  - <font style="color:rgb(15, 17, 21);">将嵌入向量归一化为单位长度</font>
  - <font style="color:rgb(15, 17, 21);">必须开启，因为Chroma默认使用余弦相似度</font>
  - <font style="color:rgb(15, 17, 21);">归一化后，点积 = 余弦相似度</font>
+ **<font style="color:rgb(15, 17, 21);">texts</font>**<font style="color:rgb(15, 17, 21);">: 要索引的文本列表</font>
+ **<font style="color:rgb(15, 17, 21);">embedding</font>**<font style="color:rgb(15, 17, 21);">: 使用的嵌入模型</font>
+ **<font style="color:rgb(15, 17, 21);">persist_directory</font>**<font style="color:rgb(15, 17, 21);">:</font>
  - <font style="color:rgb(15, 17, 21);">数据库保存路径</font>
+ **<font style="color:rgb(15, 17, 21);">similarity_search("中国著名景点", k=1)</font>**<font style="color:rgb(15, 17, 21);">:</font>
  - <font style="color:rgb(15, 17, 21);">查询："中国著名景点"</font>
  - <font style="color:rgb(15, 17, 21);">k=1: 返回最相似的1个结果</font>

<!-- 这是一张图片，ocr 内容为： -->

![](https://cdn.nlark.com/yuque/0/2025/png/32623986/1766640562521-74993069-c9cb-4d1a-8f83-fb9491a0472f.png)

```python
chroma_db/          # 数据库目录
├── chroma.sqlite3   # 主元数据数据库
├── [哈希ID]          # 嵌入向量存储目录
│   ├── data_level0.bin    # 向量数据文件
│   ├── header.bin         # 向量文件头信息
│   ├── length.bin         # 向量长度信息
│   ├── link_lists.bin     # 向量索引结构
│   └── (可能还有其他.bin文件)
└── (可能有更多[哈希ID]目录)


工作原理图解：

文本查询 → 向量化 → 相似性搜索
                      ↓
                 chroma.sqlite3 (查ID和元数据)
                      ↓
                 [哈希ID]/data_level0.bin (获取实际向量)
                      ↓
                 [哈希ID]/link_lists.bin (使用HNSW加速搜索)
                      ↓
返回最相似的文档
```

**[哈希ID]目录 (如：900e340b-b886-403f-bef0...)：**

**作用：**存储实际的向量数据和索引

**特点：**

    - 目录名是随机生成的哈希ID
    - 每个集合（collection）可能有自己的哈希目录
    - 用于版本管理和数据隔离

**data_level0.bin：**

**<font style="color:rgb(15, 17, 21);">作用</font>**<font style="color:rgb(15, 17, 21);">：存储实际的向量数据（浮点数数组）  
</font>**<font style="color:rgb(15, 17, 21);">格式</font>**<font style="color:rgb(15, 17, 21);">：</font>

    - <font style="color:rgb(15, 17, 21);">二进制格式，存储密集向量</font>
    - <font style="color:rgb(15, 17, 21);">每个向量是固定维度的浮点数数组</font>
    - <font style="color:rgb(15, 17, 21);">对于BGE模型，通常是768维（bge-base-zh-v1-5）</font>

**header.bin：**

**<font style="color:rgb(15, 17, 21);">作用</font>**<font style="color:rgb(15, 17, 21);">：存储向量数据的头部信息  
</font>**<font style="color:rgb(15, 17, 21);">包含信息</font>**<font style="color:rgb(15, 17, 21);">：</font>

    - <font style="color:rgb(15, 17, 21);">向量维度</font>
    - <font style="color:rgb(15, 17, 21);">数据类型（通常是float32）</font>
    - <font style="color:rgb(15, 17, 21);">向量数量</font>
    - <font style="color:rgb(15, 17, 21);">文件格式版本</font>

**length.bin：**

**<font style="color:rgb(15, 17, 21);">作用</font>**<font style="color:rgb(15, 17, 21);">：存储向量的长度信息（如果使用归一化）  
</font>**<font style="color:rgb(15, 17, 21);">注意</font>**<font style="color:rgb(15, 17, 21);">：</font>

    - <font style="color:rgb(15, 17, 21);">当</font>`<font style="color:rgb(15, 17, 21);">normalize_embeddings=True</font>`<font style="color:rgb(15, 17, 21);">时特别重要</font>
    - <font style="color:rgb(15, 17, 21);">用于快速计算相似度</font>
    - <font style="color:rgb(15, 17, 21);">包含每个向量的L2范数</font>

**link_lists.bin：**

**<font style="color:rgb(15, 17, 21);">作用</font>**<font style="color:rgb(15, 17, 21);">：存储HNSW（Hierarchical Navigable Small World）图索引结构  
</font>**<font style="color:rgb(15, 17, 21);">功能</font>**<font style="color:rgb(15, 17, 21);">：</font>

    - <font style="color:rgb(15, 17, 21);">加速近似最近邻搜索</font>
    - <font style="color:rgb(15, 17, 21);">构建向量间的多层导航图</font>
    - <font style="color:rgb(15, 17, 21);">使相似性搜索更高效（O(log n)复杂度）</font>

| <font style="color:rgb(17, 17, 51);">向量数量</font> | <font style="color:rgb(17, 17, 51);">查询延迟（CPU）</font> | <font style="color:rgb(17, 17, 51);">内存占用</font>    |
| ------------------------------------------------ | ----------------------------------------------------- | --------------------------------------------------- |
| <font style="color:rgb(17, 17, 51);">1 万</font>  | <font style="color:rgb(17, 17, 51);">< 10 ms</font>   | <font style="color:rgb(17, 17, 51);">~100 MB</font> |
| <font style="color:rgb(17, 17, 51);">10 万</font> | <font style="color:rgb(17, 17, 51);">~50 ms</font>    | <font style="color:rgb(17, 17, 51);">~1 GB</font>   |
| <font style="color:rgb(17, 17, 51);">50 万</font> | <font style="color:rgb(17, 17, 51);">> 200 ms</font>  | <font style="color:rgb(17, 17, 51);">~5 GB</font>   |

**超过 10 万向量后性能显著下降**，此时应考虑：切换到 **FAISS**（高性能）或 **Milvus**（可扩展）

**何时使用 Chroma？—— 场景决策**

**推荐使用 Chroma 的场景：**

+ 快速搭建 RAG demo（< 1 天）
+ 个人知识库 / 小团队内部工具
+ 教学 / 实验 

**不推荐使用 Chroma 的场景：**

+ <font style="color:rgb(17, 17, 51);">用户量 > 1000 的生产系统</font>
+ <font style="color:rgb(17, 17, 51);">需要复杂过滤（如 OR、全文检索）</font>
+ <font style="color:rgb(17, 17, 51);">向量数量 > 50 万</font>
+ <font style="color:rgb(17, 17, 51);">需要高可用 / 多租户 / 审计日志</font>

**FAISS**

**<font style="color:rgb(17, 17, 51);">FAISS（Facebook AI Similarity Search）</font>**<font style="color:rgb(17, 17, 51);"> 是由 Meta（原 Facebook）AI 团队开发的</font>**<font style="color:rgb(17, 17, 51);">高性能向量相似度搜索库</font>**<font style="color:rgb(17, 17, 51);">，专为</font>**<font style="color:rgb(17, 17, 51);">大规模稠密向量的快速最近邻检索</font>**<font style="color:rgb(17, 17, 51);">而设计。它不是传统意义上的“数据库”，而是一个</font>**<font style="color:rgb(17, 17, 51);">嵌入式 C++/Python 库</font>**<font style="color:rgb(17, 17, 51);">，广泛应用于推荐系统、语义搜索、RAG（检索增强生成）等场景。</font>

**“FAISS 是向量检索的‘内燃机’——强大但需要你自己造车。”**

| <font style="color:rgb(17, 17, 51);">特性</font>       | <font style="color:rgb(17, 17, 51);">说明</font>                            |
| ---------------------------------------------------- | ------------------------------------------------------------------------- |
| **<font style="color:rgb(17, 17, 51);">本质</font>**   | <font style="color:rgb(17, 17, 51);">向量相似度计算引擎（非完整数据库）</font>             |
| **<font style="color:rgb(17, 17, 51);">优势</font>**   | <font style="color:rgb(17, 17, 51);">极致性能（GPU 加速后每秒百万查询）、内存高效、索引灵活</font> |
| **<font style="color:rgb(17, 17, 51);">劣势</font>**   | <font style="color:rgb(17, 17, 51);">无元数据管理、不支持动态更新、需自行封装服务</font>        |
| **<font style="color:rgb(17, 17, 51);">适用规模</font>** | <font style="color:rgb(17, 17, 51);">千万级以下（单机），更大规模需分片或换 Milvus</font>    |

**<font style="color:rgb(17, 17, 51);">与Langchain集成</font>**

```python
pip install faiss-cpu

# 如果需要gpu版
# 需先安装匹配的 PyTorch + CUDA
# pip install faiss-gpu
```

```python
'''
Author: MG
Date: 2025-12-24 11:41:02
LastEditors: MG
LastEditTime: 2025-12-25 14:21:08
Description: 
Module: ${fileBasenameNoExtension}
'''
from sentence_transformers import SentenceTransformer
import faiss    # FAISS核心库
from langchain_community.vectorstores import FAISS    # LangChain的FAISS包装器
from langchain_huggingface import HuggingFaceEmbeddings        # 嵌入模型


# r"" 表示原始字符串，避免转义字符问题
model_path = r"D:\Ai\model\BAAI\bge-base-zh-v1-5"

# model_embed = SentenceTransformer(device="cpu", model_name_or_path=model_path)

# 示例文本
texts = [
    "北京故宫是中国明清两代的皇家宫殿",
    "上海外滩是著名的滨江观光带",
    "杭州西湖风景优美，有十景之说",
]
embeddings = HuggingFaceEmbeddings(
    model_name=model_path,        # 模型路径
    model_kwargs={"device": "cpu"},        # 在CPU上运行
    encode_kwargs={"normalize_embeddings": True},        # 向量归一化
)


def create_faiss(texts, embeddings):
    """create_faiss 构建向量库并持久化

    :param texts: 数据
    :type texts: list
    :param embeddings: embeddings
    :type embeddings: _type_
    """
    # 构建向量库
    vectorstore = FAISS.from_texts(texts=texts, embedding=embeddings)
    # 持久化保存
    vectorstore.save_local("./faiss_db")


def load_faiss():
    vectorstore = FAISS.load_local(
        folder_path="./faiss_db",    # 加载路径
        embeddings=embeddings,         # 必须提供相同的嵌入模型
        allow_dangerous_deserialization=True,
    )
    vectorstore.add_texts(["西藏布达拉宫"])    # 添加新文本
    return vectorstore


if __name__ == "__main__":
    # create_faiss(texts, embeddings)
    vectorstore = load_faiss()
    print(vectorstore.similarity_search(query="皇宫", k=2))
```

⚠️LangChain 的 FAISS 封装**不支持自定义索引类型**（默认 IndexFlatIP）

**参数解释：**

**FAISS.from_texts()：**

将文本列表转换为向量并创建FAISS索引

**save_local()：**

保存到./faiss_db目录，会生成两个文件：index.faiss（向量索引）和index.pkl（元数据）

**allow_dangerous_deserialization=True：**

LangChain团队为了安全，默认禁止从pickle文件加载

必须显式设置 allow_dangerous_deserialization=True，不然会抛出错误

**add_texts():** 

向已有索引添加新文本

<!-- 这是一张图片，ocr 内容为： -->

![](https://cdn.nlark.com/yuque/0/2025/png/32623986/1766644632378-a6b20326-6ebf-43be-a916-0a57b415c59f.png)

```python
faiss_db/          # FAISS数据库目录
├── index.faiss    # FAISS向量索引文件（二进制）
└── index.pkl      # 元数据文件（Python pickle格式）
```

**index.faiss (FAISS索引文件):**

**<font style="color:rgb(15, 17, 21);">格式</font>**<font style="color:rgb(15, 17, 21);">：二进制文件  
</font>**<font style="color:rgb(15, 17, 21);">作用</font>**<font style="color:rgb(15, 17, 21);">：存储实际的向量数据和索引结构  
</font>**<font style="color:rgb(15, 17, 21);">包含内容</font>**<font style="color:rgb(15, 17, 21);">：</font>

    - <font style="color:rgb(15, 17, 21);">所有文本的向量表示（浮点数数组）</font>
    - <font style="color:rgb(15, 17, 21);">FAISS索引结构（如IVFFlat、HNSW等）</font>
    - <font style="color:rgb(15, 17, 21);">用于加速搜索的索引数据</font>

****

**index.pkl (Pickle元数据文件):**

**<font style="color:rgb(15, 17, 21);">格式</font>**<font style="color:rgb(15, 17, 21);">：Python pickle序列化文件</font>  
**<font style="color:rgb(15, 17, 21);">作用</font>**<font style="color:rgb(15, 17, 21);">：存储文本内容和映射信息</font>

**<font style="color:rgb(15, 17, 21);">包含内容</font>**<font style="color:rgb(15, 17, 21);">：</font>

```python
{
    "docstore": {  # 文档存储
        "doc_id_1": "北京故宫是中国明清两代的皇家宫殿",
        "doc_id_2": "上海外滩是著名的滨江观光带",
        # ...
    },
    "index_to_docstore_id": {  # 索引到文档ID的映射
        0: "doc_id_1",
        1: "doc_id_2",
        # ...
    },
    "embedding_function": None,  # 通常为空，需要重新提供
    # 可能还有其他配置信息
}
```

**<font style="color:rgb(15, 17, 21);">安全警告</font>**<font style="color:rgb(15, 17, 21);">：</font>

    - <font style="color:rgb(15, 17, 21);">Pickle文件可以包含</font>**<font style="color:rgb(15, 17, 21);">任意Python代码</font>**
    - <font style="color:rgb(15, 17, 21);">反序列化时会</font>**<font style="color:rgb(15, 17, 21);">执行</font>**<font style="color:rgb(15, 17, 21);">这些代码</font>
    - <font style="color:rgb(15, 17, 21);">这就是为什么需要 allow_dangerous_deserialization=True</font>
    - <font style="color:rgb(15, 17, 21);"></font>

```python
相似性搜索流程：
1. 查询文本 → embeddings模型 → 查询向量
2. 查询向量 → index.faiss → 最相似的向量索引(如[0, 2])
3. 向量索引[0, 2] → index.pkl (映射) → 文档ID[doc_id_1, doc_id_3]
4. 文档ID → index.pkl (docstore) → 实际文本内容
```

**<font style="color:rgb(17, 17, 51);">索引选型指南</font>**

| 数据规模        | 推荐索引          | 参数建议                                 |
| ----------- | ------------- | ------------------------------------ |
| < 1 万       | IndexFlatIP   | 无参数                                  |
| 1 万 ~ 100 万 | IndexIVFFlat  | nlist = sqrt(N)，nprobe = 10~100      |
| > 100 万     | IndexIVFPQ    | m=16~64，nbits=8（量化压缩）                |
| 低延迟 (<20ms) | IndexHNSWFlat | M=16，efConstruction=200，efSearch=128 |

**<font style="color:rgb(17, 17, 51);">典型应用场景</font>**

1. **<font style="color:rgb(17, 17, 51);">本地 RAG 应用</font>**<font style="color:rgb(17, 17, 51);">：个人知识库问答（配合 Llama.cpp / Ollama）</font>
2. **<font style="color:rgb(17, 17, 51);">推荐系统离线召回</font>**<font style="color:rgb(17, 17, 51);">：从百万商品中召回 Top-100</font>
3. **<font style="color:rgb(17, 17, 51);">图像/视频相似检索</font>**<font style="color:rgb(17, 17, 51);">：基于 CLIP embedding 的以图搜图</font>
4. **<font style="color:rgb(17, 17, 51);">学术论文查重</font>**<font style="color:rgb(17, 17, 51);">：计算文本相似度</font>
5. **<font style="color:rgb(17, 17, 51);">边缘设备部署</font>**<font style="color:rgb(17, 17, 51);">：FAISS CPU 版可在 Jetson Nano 运行</font>

**<font style="color:rgb(17, 17, 51);">性能优化技巧</font>**

| 技术         | 说明                                                                 |
| ---------- | ------------------------------------------------------------------ |
| **GPU 加速** | faiss-gpu + index = faiss.index_cpu_to_all_gpus(index)  自动配置到所有GPU |
| **批量查询**   | 一次 encode 多个 query，再批量 search                                      |
| **量化压缩**   | IndexIVFPQ    内存减半，速度提升                                            |
| **异步加载**   | 启动时后台加载模型/索引                                                       |
| **内存映射**   | 超大索引用 faiss.read_index(..., faiss.IO_FLAG_MMAP)                    |

**FAISS 索引**

<!-- 这是一张图片，ocr 内容为： -->

![](https://cdn.nlark.com/yuque/0/2025/png/32623986/1766654009962-0013ee19-6963-44c0-9148-e8eb2fdc6d44.png)

```python
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np


model_path = r"D:\Ai\model\BAAI\bge-base-zh-v1-5"

sentences = [
    "人工智能是计算机科学的一个分支",
    "机器学习是实现人工智能的方法之一",
    "深度学习使用神经网络进行特征学习",
    "自然语言处理让机器理解人类语言",
    "计算机视觉使机器能够‘看’世界",
    "强化学习通过试错来优化决策",
    "大模型需要大量数据和算力训练",
    "向量数据库用于高效相似性搜索",
    "FAISS 是 Meta 开发的向量检索库",
    "Chroma 是轻量级向量数据库",
    "Milvus 支持十亿级向量检索",
    "BGE 是中文效果最好的开源 embedding 模型之一",
    "RAG 结合检索与生成提升问答质量",
    "LangChain 是构建 LLM 应用的框架",
    "Ollama 可以在本地运行大语言模型",
]

query = "哪个工具适合做本地向量检索？"
query_k = ["本地向量检索？", "工具"]

model = SentenceTransformer(model_path, device="cpu")

embeddings = model.encode(
    sentences=sentences, batch_size=8, normalize_embeddings=True
).astype("float32")
query_vec = model.encode([query], normalize_embeddings=True).astype("float32")
query_vec_1 = model.encode(query_k, normalize_embeddings=True).astype("float32")
```

**IndexFlatIP：暴力精确搜索**

**原理：**

+ **<font style="color:rgb(17, 17, 51);">不做任何预处理</font>**<font style="color:rgb(17, 17, 51);">，对每个查询向量 </font>_<font style="color:rgb(17, 17, 51);">q</font>_<font style="color:rgb(17, 17, 51);">，遍历数据库中所有 </font>_<font style="color:rgb(17, 17, 51);">N</font>_<font style="color:rgb(17, 17, 51);"> 个向量 </font>$ x_i $<font style="color:rgb(17, 17, 51);">，计算内积 </font>$ q . x_i $<font style="color:rgb(17, 17, 51);">。</font>
+ <font style="color:rgb(17, 17, 51);">返回内积最大的前 </font>_<font style="color:rgb(17, 17, 51);">k</font>_<font style="color:rgb(17, 17, 51);"> 个结果</font>

**<font style="color:rgb(17, 17, 51);">复杂度：</font>**

+ **<font style="color:rgb(17, 17, 51);">时间</font>**<font style="color:rgb(17, 17, 51);">：</font>_<font style="color:rgb(17, 17, 51);">O</font>_<font style="color:rgb(17, 17, 51);">(</font>_<font style="color:rgb(17, 17, 51);">N</font>_<font style="color:rgb(17, 17, 51);">⋅</font>_<font style="color:rgb(17, 17, 51);">d</font>_<font style="color:rgb(17, 17, 51);">)</font><font style="color:rgb(17, 17, 51);">，其中</font><font style="color:rgb(17, 17, 51);"> </font>_<font style="color:rgb(17, 17, 51);">d</font>_<font style="color:rgb(17, 17, 51);"> </font><font style="color:rgb(17, 17, 51);">是向量维度</font>
+ **<font style="color:rgb(17, 17, 51);">空间</font>**<font style="color:rgb(17, 17, 51);">：</font>_<font style="color:rgb(17, 17, 51);">O</font>_<font style="color:rgb(17, 17, 51);">(</font>_<font style="color:rgb(17, 17, 51);">N</font>_<font style="color:rgb(17, 17, 51);">⋅</font>_<font style="color:rgb(17, 17, 51);">d</font>_<font style="color:rgb(17, 17, 51);">)（仅存储原始向量）</font>

**<font style="color:rgb(17, 17, 51);">优点:</font>**

+ <font style="color:rgb(17, 17, 51);">实现简单，100% 精确</font>
+ <font style="color:rgb(17, 17, 51);">支持任意距离度量（IP / L2）</font>
+ <font style="color:rgb(17, 17, 51);">可动态增删（通过  add() / 构建新索引）</font>

**<font style="color:rgb(17, 17, 51);">缺点:</font>**

+ <font style="color:rgb(17, 17, 51);">速度随 N 线性下降，不适用于大规模数据</font>
+ <font style="color:rgb(17, 17, 51);">无加速结构</font>

**<font style="color:rgb(17, 17, 51);">适用场景:</font>**

+ <font style="color:rgb(17, 17, 51);">向量数 < 10,000</font>
+ <font style="color:rgb(17, 17, 51);">需要绝对精确结果（如评估基准）</font>
+ <font style="color:rgb(17, 17, 51);">快速原型验证</font>

```python
# 获取嵌入向量的维度（每个向量的长度）
d = embeddings.shape[1]

# 创建一个索引
index = faiss.IndexFlatIP(d)

# 将 embeddings 中的所有向量添加到索引中
index.add(embeddings)


# query_vec：查询向量
# k=3：返回最相似的 3 个结果
# distances：相似度分数（距离/相似度数组）
# indices：相似向量在原始 embeddings 中的索引位置（索引数组）

k = 3
distances, indices = index.search(query_vec, k=k)


# (1, 3)  ->  (一个查询向量，最相似的 3 个结果)
print(f"distances 形状: {distances.shape}")  # (1, 3) 
print(f"indices 形状: {indices.shape}")      # (1, 3)
print(distances)    # [[0.58901465 0.58901465 0.58901465]]
print(indices)  # [[37 22  7]]

# 特点：
# 简单直接
# 100% 精确（暴力搜索）
# 适合 < 1 万向量
```

```python
        查询向量 q
              ●
             /|\
            / | \
           /  |  \
          /   |   \
         /    |    \
        /     |     \
       /      |      \
      /       |       \
     /        |        \
    /         |         \
   ●──────────●──────────●
 x₁          x₂         x₃   ← 所有向量都要计算距离！
   \         / \         /
    \       /   \       /
     \     /     \     /
      \   /       \   /
       \ /         \ /
        ●           ●
       x₄          x₅
```

---

**IndexIVFFlat：倒排文件 + 精确子搜索**

**核心思想：分而治之 + 近似最近邻**

<font style="color:rgb(17, 17, 51);">将整个向量空间划分为若干</font>**<font style="color:rgb(17, 17, 51);">局部区域（聚类）</font>**<font style="color:rgb(17, 17, 51);">，查询时只在“最可能”的几个区域内搜索。</font>

当  nprobe < nlist 时，速度远快于 IndexFlat

**<font style="color:rgb(17, 17, 51);">优点:</font>**

+ **<font style="color:rgb(17, 17, 51);">精度可控</font>**<font style="color:rgb(17, 17, 51);">：增大 nprobe 可逼近 100% 召回</font>
+ **<font style="color:rgb(17, 17, 51);">内存友好</font>**<font style="color:rgb(17, 17, 51);">：只存原始向量（无图结构开销）</font>
+ **<font style="color:rgb(17, 17, 51);">GPU 友好</font>**<font style="color:rgb(17, 17, 51);">：FAISS GPU 版本高度优化 IVF</font>

**<font style="color:rgb(17, 17, 51);">缺点:</font>**

+ <font style="color:rgb(17, 17, 51);">需要训练阶段</font>
+ <font style="color:rgb(17, 17, 51);">聚类质量影响性能（高维稀疏数据效果下降）</font>

**适用场景:**

+ <font style="color:rgb(17, 17, 51);">工业级 RAG / 推荐系统</font>
+ <font style="color:rgb(17, 17, 51);">向量数：1 万 ~ 1 亿</font>
+ <font style="color:rgb(17, 17, 51);">需要平衡速度与精度</font>

```python
# IndexIVFFlat 索引   近似搜索


# d：向量维度
# n_data：数据集中向量的总数
d = embeddings.shape[1]
n_data = len(embeddings)

# nlist：将数据空间划分的簇（桶）的数量
# 经验法则：nlist ≈ √(数据量)
# 关键参数：nlist ≈ sqrt(N)
nlist = int(np.sqrt(n_data))  

# IndexFlatIP：使用内积进行精确搜索的索引
# 量化器的作用：对每个簇的中心点进行精确搜索,这里使用的是内积度量
# 创建量化器（用 FlatIP）
quantizer =faiss.IndexFlatIP(d)


# faiss.METRIC_INNER_PRODUCT：使用内积作为相似度度量
# 创建 IVF 索引
index=faiss.IndexIVFFlat(quantizer,d,nlist,faiss.METRIC_INNER_PRODUCT)

# 对 IVF 索引进行训练，这一步只需要执行一次
index.train(embeddings)

# 添加数据
index.add(embeddings)


# 搜索时检查的簇的数量，nprobe = nlist → 退化为精确搜索
# 默认值：1（只搜索最近的簇）,设置为 5：搜索 5 个最近的簇
# 设置 nprobe（控制精度/速度）
index.nprobe = 5  # 默认 1，越大越准越慢

# 检索
distances, indices = index.search(query_vec_1, k=3)

print(distances) #（2,3）
# [[0.5914595  0.5914595  0.5914595 ]
#  [0.47730094 0.47730094 0.47730094]]

print(indices) #（2,3）
# [[37 22  7]
#  [31 16  1]]


搜索流程（近似搜索）：
第一阶段：使用量化器找到距离查询向量最近的 nprobe 个簇
    计算查询向量与所有簇中心的距离
    选择最近的 nprobe 个簇（这里是 5 个

第二阶段：只在选中的簇内进行精确搜索
    在选中的 5 个簇中，搜索所有向量
    返回全局的 top-k 结果
```

```python
整个向量空间被划分为若干“簇”（聚类）

        ● c₁       ● c₂       ● c₃      ← 聚类中心（centroids）
       /|\         /|\         /|\
      / | \       / | \       / | \
     /  |  \     /  |  \     /  |  \
    ●   ●   ●   ●   ●   ●   ●   ●   ●   ← 数据向量（按簇分组）
   x₁  x₂  x₃  x₄  x₅  x₆  x₇  x₈  x₉

查询流程：
1. 计算 q 到所有中心的距离 → 找到最近的 nprobe=2 个簇（如 c₁, c₂）
2. 只在 c₁ 和 c₂ 对应的向量中搜索（x₁~x₆）
3. 忽略 c₃ 区域（x₇~x₉）

        查询向量 q
              ●
             /
            / 
           /   
          /     
         /       
        /         
       /           
      /             
     /               
    /                 
   ●──────────●──────────●
 x₁ (c₁)    x₄ (c₂)    x₇ (c₃)  ← 只搜索 c₁, c₂ 区域！
```

---

**IndexHNSWFlat**

**核心思想：构建多层图，实现“快速跳转 + 局部精细搜索”**



**<font style="color:rgb(17, 17, 51);">优点:</font>**

+ <font style="color:rgb(17, 17, 51);">查询延迟极低（常 < 1ms 百万级）</font>
+ <font style="color:rgb(17, 17, 51);">无需训练，插入即用</font>
+ <font style="color:rgb(17, 17, 51);">高召回率（</font>`<font style="color:rgb(17, 17, 51);background-color:rgba(175, 184, 193, 0.2);">efSearch ≥ 100</font>`<font style="color:rgb(17, 17, 51);"> </font><font style="color:rgb(17, 17, 51);">时 ≈ 99%+）</font>

**<font style="color:rgb(17, 17, 51);">缺点:</font>**

+ <font style="color:rgb(17, 17, 51);">内存占用高（是 Flat 的 3~8 倍）</font>
+ <font style="color:rgb(17, 17, 51);">不支持删除（只能重建）</font>
+ <font style="color:rgb(17, 17, 51);">GPU 支持有限（FAISS GPU 主要优化 IVF）</font>

**<font style="color:rgb(17, 17, 51);">适用场景:</font>**

+ <font style="color:rgb(17, 17, 51);">实时搜索系统（如电商商品推荐）</font>
+ <font style="color:rgb(17, 17, 51);">低延迟要求（< 20ms）</font>
+ <font style="color:rgb(17, 17, 51);">向量数 < 1000 万（内存允许）</font>

| 参数             | <font style="color:rgb(17, 17, 51);">含义</font>             | <font style="color:rgb(17, 17, 51);">默认/建议</font>             |
| -------------- | ---------------------------------------------------------- | ------------------------------------------------------------- |
| M              | <font style="color:rgb(17, 17, 51);">每个节点的最大连接数（底层）</font> | <font style="color:rgb(17, 17, 51);">8~64（越大越准越占内存）</font>    |
| efConstruction | <font style="color:rgb(17, 17, 51);">构建时的候选队列大小</font>     | <font style="color:rgb(17, 17, 51);">100~200（越大构建越慢越准）</font> |
| efSearch       | <font style="color:rgb(17, 17, 51);">搜索时的候选队列大小</font>     | <font style="color:rgb(17, 17, 51);">10~200（越大越准越慢）</font>    |

```python
# IndexHNSWFlat 索引    超低延迟图索引


d = embeddings.shape[1]

# 初始化 HNSW 索引
# M: 每个节点在图中最大连接数（越大越准越占内存）
# efConstruction: 构建时的搜索深度
index = faiss.IndexHNSWFlat(d, 16)
index.hnsw.efConstruction = 100  # 构建质量
index.hnsw.efSearch = 50         # 搜索时的候选数

# 对向量进行 L2 归一化
faiss.normalize_L2(embeddings)
faiss.normalize_L2(query_vec_1)

# HNSW 在添加数据时就构建了图结构，不需要单独的 train() 步骤
index.add(embeddings)

distances, indices = index.search(query_vec_1, k=3)
print(distances)    
# [[0.8170811 0.8170811 0.8170811]
#  [1.045398  1.045398  1.045398 ]]

print(indices)  
# [[ 142  592  667]
#  [ 256 1021 1051]]

# 在线服务要求 < 10ms 延迟
# 不需要动态删除

M 的影响：
    M 越大：图更稠密，精度更高，但内存占用更大
    M 越小：图更稀疏，内存占用小，但精度可能降低
    典型值：4-64，16 是常用值


efConstruction（构建参数）：
    插入新节点时的搜索深度
    值越大：构建质量越高，索引更准确
    值越小：构建速度越快，索引质量可能下降
    作用：控制构建索引时的精度


efSearch（搜索参数）：
    搜索时的候选列表大小
    值越大：搜索结果越准确，但搜索越慢
    值越小：搜索越快，但可能错过最近邻
    作用：控制搜索时的精度

1. 从最高层随机节点开始
2. 在当前层找到最近的节点
3. 进入下一层，继续搜索
4. 重复直到第 0 层
5. 在第 0 层进行细化搜索
```

```python
Layer 2 (顶层，稀疏)：
        ● e  ← 入口点（Enter point）
       / \
      /   \
     ●     ●

Layer 1 (中层)：
    ●───●───●───●
     \ /     \ /
      ●       ●

Layer 0 (底层，稠密)：
●──●──●──●──●──●──●──●──●
|\/|\/|\/|\/|\/|\/|\/|\/|
●──●──●──●──●──●──●──●──●
 ↑
 查询起点：从顶层 e 开始

查询路径（贪心搜索）：
q → e (L2) → 最近邻居 (L2) → 下降 → ... → 底层精细搜索

查询开始
   ↓
[Layer 2] 从入口点 e 出发
   ↓
贪心移动：e → A（因 ⟨q,A⟩ > ⟨q,e⟩）
   ↓
A 在 Layer 2 无更优邻居 → 下降到 Layer 1 的 A'
   ↓
[Layer 1] A' → B' → C'（不断找内积更大的邻居）
   ↓
C' 无法改进 → 下降到 Layer 0 的 C''
   ↓
[Layer 0] C'' → D'' → E'' → F''（精细局部搜索）
   ↓
返回 Top-K（如 E'', F''）
```

---

| <font style="color:rgb(17, 17, 51);">维度</font>       | <font style="color:rgb(17, 17, 51);background-color:rgba(175, 184, 193, 0.2);">IndexFlatIP</font> | <font style="color:rgb(17, 17, 51);background-color:rgba(175, 184, 193, 0.2);">IndexIVFFlat</font> | <font style="color:rgb(17, 17, 51);background-color:rgba(175, 184, 193, 0.2);">IndexHNSWFlat</font> |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **<font style="color:rgb(17, 17, 51);">加速思想</font>** | <font style="color:rgb(17, 17, 51);">无</font>                                                     | <font style="color:rgb(17, 17, 51);">空间划分（聚类）</font>                                               | <font style="color:rgb(17, 17, 51);">图结构导航</font>                                                   |
| **<font style="color:rgb(17, 17, 51);">搜索策略</font>** | <font style="color:rgb(17, 17, 51);">全局暴力</font>                                                  | <font style="color:rgb(17, 17, 51);">局部暴力（选区）</font>                                               | <font style="color:rgb(17, 17, 51);">贪心图遍历</font>                                                   |
| **<font style="color:rgb(17, 17, 51);">是否近似</font>** | <font style="color:rgb(17, 17, 51);">否</font>                                                     | <font style="color:rgb(17, 17, 51);">是</font>                                                      | <font style="color:rgb(17, 17, 51);">是</font>                                                       |
| **<font style="color:rgb(17, 17, 51);">召回上限</font>** | <font style="color:rgb(17, 17, 51);">100%</font>                                                  | <font style="color:rgb(17, 17, 51);">可达 100%（nprobe↑）</font>                                       | <font style="color:rgb(17, 17, 51);"><100%（但可 >99%）</font>                                          |
| **<font style="color:rgb(17, 17, 51);">动态更新</font>** | <font style="color:rgb(17, 17, 51);">简单</font>                                                    | <font style="color:rgb(17, 17, 51);">简单</font>                                                     | <font style="color:rgb(17, 17, 51);">不支持删除</font>                                                   |
| **<font style="color:rgb(17, 17, 51);">构建成本</font>** | <font style="color:rgb(17, 17, 51);">无</font>                                                     | <font style="color:rgb(17, 17, 51);">中（需聚类）</font>                                                 | <font style="color:rgb(17, 17, 51);">高（建图）</font>                                                   |
| **<font style="color:rgb(17, 17, 51);">内存效率</font>** | <font style="color:rgb(17, 17, 51);">最高</font>                                                    | <font style="color:rgb(17, 17, 51);">高</font>                                                      | <font style="color:rgb(17, 17, 51);">低</font>                                                       |

**<font style="color:rgb(17, 17, 51);">Milvus</font>**

**<font style="color:rgb(17, 17, 51);"></font>**

| <font style="color:rgb(17, 17, 51);">特性</font>          | **<font style="color:rgb(17, 17, 51);">FAISS</font>**                                                                                                                                                                                                                                       | **<font style="color:rgb(17, 17, 51);">Chroma</font>**                                              | **<font style="color:rgb(17, 17, 51);">Milvus</font>**                                                          |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **<font style="color:rgb(17, 17, 51);">开发方</font>**     | <font style="color:rgb(17, 17, 51);">Meta (Facebook)</font>                                                                                                                                                                                                                                 | <font style="color:rgb(17, 17, 51);">Chroma Inc.</font>                                             | <font style="color:rgb(17, 17, 51);">Zilliz（开源）</font>                                                          |
| **<font style="color:rgb(17, 17, 51);">定位</font>**      | <font style="color:rgb(17, 17, 51);">向量相似度搜索库</font>                                                                                                                                                                                                                                        | <font style="color:rgb(17, 17, 51);">轻量级向量数据库</font>                                                | <font style="color:rgb(17, 17, 51);">企业级分布式向量数据库</font>                                                         |
| **<font style="color:rgb(17, 17, 51);">语言支持</font>**    | <font style="color:rgb(17, 17, 51);">C++ / Python</font>                                                                                                                                                                                                                                    | <font style="color:rgb(17, 17, 51);">Python / JS</font>                                             | <font style="color:rgb(17, 17, 51);">Python / Go / Java / REST / gRPC</font>                                    |
| **<font style="color:rgb(17, 17, 51);">部署方式</font>**    | <font style="color:rgb(17, 17, 51);">嵌入式（库）</font>                                                                                                                                                                                                                                          | <font style="color:rgb(17, 17, 51);">单机服务 / 嵌入式</font>                                              | <font style="color:rgb(17, 17, 51);">单机 / 分布式集群</font>                                                          |
| **<font style="color:rgb(17, 17, 51);">数据规模</font>**    | <font style="color:rgb(17, 17, 51);">≤ 1000 万</font>                                                                                                                                                                                                                                        | <font style="color:rgb(17, 17, 51);">≤ 100 万</font>                                                 | **<font style="color:rgb(17, 17, 51);">10 亿+</font>**                                                           |
| **<font style="color:rgb(17, 17, 51);">持久化</font>**     | <font style="color:rgb(17, 17, 51);">手动保存</font><font style="color:rgb(17, 17, 51);"> </font>`<font style="color:rgb(17, 17, 51);background-color:rgba(175, 184, 193, 0.2);">.index</font>`<br/><font style="color:rgb(17, 17, 51);"> </font><font style="color:rgb(17, 17, 51);">文件</font> | <font style="color:rgb(17, 17, 51);">自动（SQLite / DuckDB / ClickHouse）</font>                        | <font style="color:rgb(17, 17, 51);">自动（MinIO + etcd + Pulsar）</font>                                           |
| **<font style="color:rgb(17, 17, 51);">实时增删改</font>**   | <font style="color:rgb(17, 17, 51);">❌</font><font style="color:rgb(17, 17, 51);">（需重建）</font>                                                                                                                                                                                              | <font style="color:rgb(17, 17, 51);">✅</font><font style="color:rgb(17, 17, 51);">（有限）</font>       | <font style="color:rgb(17, 17, 51);">✅</font><font style="color:rgb(17, 17, 51);">（完整支持）</font>                 |
| **<font style="color:rgb(17, 17, 51);">标量过滤</font>**    | <font style="color:rgb(17, 17, 51);">❌</font>                                                                                                                                                                                                                                               | <font style="color:rgb(17, 17, 51);">✅</font><font style="color:rgb(17, 17, 51);">（简单 WHERE）</font> | <font style="color:rgb(17, 17, 51);">✅✅</font><font style="color:rgb(17, 17, 51);">（复杂表达式 + 索引）</font>          |
| **<font style="color:rgb(17, 17, 51);">多租户</font>**     | <font style="color:rgb(17, 17, 51);">❌</font>                                                                                                                                                                                                                                               | <font style="color:rgb(17, 17, 51);">❌</font>                                                       | <font style="color:rgb(17, 17, 51);">✅</font><font style="color:rgb(17, 17, 51);">（RBAC + 隔离）</font>            |
| **<font style="color:rgb(17, 17, 51);">GPU 支持</font>**  | <font style="color:rgb(17, 17, 51);">✅</font><font style="color:rgb(17, 17, 51);">（faiss-gpu）</font>                                                                                                                                                                                        | <font style="color:rgb(17, 17, 51);">❌</font>                                                       | <font style="color:rgb(17, 17, 51);">✅</font><font style="color:rgb(17, 17, 51);">（2.3+ 实验性）</font>             |
| **<font style="color:rgb(17, 17, 51);">高可用</font>**     | <font style="color:rgb(17, 17, 51);">❌</font>                                                                                                                                                                                                                                               | <font style="color:rgb(17, 17, 51);">❌</font>                                                       | <font style="color:rgb(17, 17, 51);">✅</font><font style="color:rgb(17, 17, 51);">（主从 / 集群）</font>              |
| **<font style="color:rgb(17, 17, 51);">监控告警</font>**    | <font style="color:rgb(17, 17, 51);">❌</font>                                                                                                                                                                                                                                               | <font style="color:rgb(17, 17, 51);">❌</font>                                                       | <font style="color:rgb(17, 17, 51);">✅</font><font style="color:rgb(17, 17, 51);">（Prometheus + Grafana）</font> |
| **<font style="color:rgb(17, 17, 51);">学习曲线</font>**    | <font style="color:rgb(17, 17, 51);">中（需懂索引）</font>                                                                                                                                                                                                                                         | <font style="color:rgb(17, 17, 51);">低（极简 API）</font>                                               | <font style="color:rgb(17, 17, 51);">高（需运维知识）</font>                                                            |
| **<font style="color:rgb(17, 17, 51);">License</font>** | <font style="color:rgb(17, 17, 51);">MIT</font>                                                                                                                                                                                                                                             | <font style="color:rgb(17, 17, 51);">Apache 2.0</font>                                              | <font style="color:rgb(17, 17, 51);">Apache 2.0</font>                                                          |

<!-- 这是一张图片，ocr 内容为： -->

![](https://cdn.nlark.com/yuque/0/2025/png/32623986/1766566922656-a3566240-8421-4b8c-8bae-f6573fdcb402.png)

**典型应用场景推荐**

| <font style="color:rgb(17, 17, 51);">场景</font>                | <font style="color:rgb(17, 17, 51);">推荐方案</font>         | <font style="color:rgb(17, 17, 51);">理由</font>                                                                                                                                                                                                                                                                  |
| ------------------------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **<font style="color:rgb(17, 17, 51);">个人知识库问答</font>**       | <font style="color:rgb(17, 17, 51);">Chroma</font>       | <font style="color:rgb(17, 17, 51);">简单、自动持久化、LangChain 无缝集成</font>                                                                                                                                                                                                                                             |
| **<font style="color:rgb(17, 17, 51);">学术论文检索（10 万篇）</font>** | <font style="color:rgb(17, 17, 51);">FAISS + 自建服务</font> | <font style="color:rgb(17, 17, 51);">高性能、低成本、无需复杂过滤</font>                                                                                                                                                                                                                                                      |
| **<font style="color:rgb(17, 17, 51);">电商平台商品搜索</font>**      | <font style="color:rgb(17, 17, 51);">Milvus</font>       | <font style="color:rgb(17, 17, 51);">需要</font><font style="color:rgb(17, 17, 51);"> </font>`<font style="color:rgb(17, 17, 51);background-color:rgba(175, 184, 193, 0.2);">category=手机 AND price<5000</font>`<br/><font style="color:rgb(17, 17, 51);"> </font><font style="color:rgb(17, 17, 51);">混合查询</font> |
| **<font style="color:rgb(17, 17, 51);">金融合规知识库</font>**       | <font style="color:rgb(17, 17, 51);">Milvus</font>       | <font style="color:rgb(17, 17, 51);">法规频繁更新，需实时插入/删除</font>                                                                                                                                                                                                                                                     |
| **<font style="color:rgb(17, 17, 51);">多租户 SaaS 智能客服</font>** | <font style="color:rgb(17, 17, 51);">Milvus</font>       | <font style="color:rgb(17, 17, 51);">租户隔离、权限控制、高可用</font>                                                                                                                                                                                                                                                       |
| **<font style="color:rgb(17, 17, 51);">边缘设备推荐</font>**        | <font style="color:rgb(17, 17, 51);">FAISS (CPU)</font>  | <font style="color:rgb(17, 17, 51);">资源受限，无需网络</font>                                                                                                                                                                                                                                                           |

| <font style="color:rgb(17, 17, 51);">你的情况</font>                    | <font style="color:rgb(17, 17, 51);">选</font>                                                                                                                                                                                                                                                                                                |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <font style="color:rgb(17, 17, 51);">“我想 10 分钟跑通一个 RAG demo”</font> | <font style="color:rgb(17, 17, 51);">✅</font><font style="color:rgb(17, 17, 51);"> </font>**<font style="color:rgb(17, 17, 51);">Chroma</font>**                                                                                                                                                                                             |
| <font style="color:rgb(17, 17, 51);">“我有 GPU，要极致检索速度”</font>        | <font style="color:rgb(17, 17, 51);">✅</font><font style="color:rgb(17, 17, 51);"> </font>**<font style="color:rgb(17, 17, 51);">FAISS</font>**                                                                                                                                                                                              |
| <font style="color:rgb(17, 17, 51);">“我要上线产品，支持百万用户”</font>         | <font style="color:rgb(17, 17, 51);">✅</font><font style="color:rgb(17, 17, 51);"> </font>**<font style="color:rgb(17, 17, 51);">Milvus</font>**                                                                                                                                                                                             |
| <font style="color:rgb(17, 17, 51);">“我需要动态更新知识库”</font>            | <font style="color:rgb(17, 17, 51);">✅</font><font style="color:rgb(17, 17, 51);"> </font>**<font style="color:rgb(17, 17, 51);">Milvus</font>**<font style="color:rgb(17, 17, 51);">（Chroma 有限支持）</font>                                                                                                                                    |
| <font style="color:rgb(17, 17, 51);">“我只有 2GB 内存的服务器”</font>        | <font style="color:rgb(17, 17, 51);">✅</font><font style="color:rgb(17, 17, 51);"> </font>**<font style="color:rgb(17, 17, 51);">FAISS</font>**<font style="color:rgb(17, 17, 51);"> </font><font style="color:rgb(17, 17, 51);">或</font><font style="color:rgb(17, 17, 51);"> </font>**<font style="color:rgb(17, 17, 51);">Chroma</font>** |
| <font style="color:rgb(17, 17, 51);">“我要做向量 + 标签混合搜索”</font>        | <font style="color:rgb(17, 17, 51);">✅</font><font style="color:rgb(17, 17, 51);"> </font>**<font style="color:rgb(17, 17, 51);">Milvus</font>**                                                                                                                                                                                             |

```python
原型阶段：Chroma（快） → FAISS（准）
生产阶段：Milvus（稳）
```
