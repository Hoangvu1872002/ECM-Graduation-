from openai import OpenAI
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import json
from pymongo import MongoClient

load_dotenv()

openai_api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=openai_api_key)

mongo_url = os.getenv("MONGODB_URL")
mongo = MongoClient(mongo_url)
mongo_db = mongo["graduateKMA"]
products_collection = mongo_db["products"]

base_url = os.getenv("base_url", "http://localhost:3000")

app = Flask(__name__)
CORS(app)

@app.route("/openai/search_products", methods=["POST"])
def search_products():
    data = request.json
    query = data.get("query", "")
    if not query:
        return jsonify({"error": "Query is required"}), 400
    structure = """
    - title (str): Tên sản phẩm; Ví dụ: "XIAOMI MI 5"
    - price (int): Giá sản phẩm; Ví dụ: 305000: "305.000 VND"
    - category (str): Loại sản phẩm; Ví dụ: "Smartphone", "Tablet", "Laptop", "Camera", "Printer", "Speaker", "Accessories", "Television"
    - quantity (int): Số lượng sản phẩm; Ví dụ: 10
    - sold (int): Số lượng đã bán; Ví dụ: 100
    - discount (int): Giảm giá; Ví dụ: 10: "10%"
    - color (str): Màu sắc sản phẩm; Ví dụ: "black"
    - brand (str): Thương hiệu sản phẩm; Ví dụ: 'ACER', 'APPLE', 'ASUS', 'DELL', 'GOOGLE', 'HP', 'HTC', 'HUAWEI', 'IPHONE', 'JBL', 'LENOVO', 'LG', 'LOGITECH', 'MOTOROLA', 'SAMSUNG', 'SENNHEISER', 'SONY', 'USB', 'VIVO', 'XIAOMI'
    - totalRating (int): trung bình đánh giá; Ví dụ: 4
    """
    try:
        response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
                    {
                        "role": "system",
                        "content": "Bạn là một trợ lý chuyên viết truy vấn tìm kiếm cho MongoDB từ câu hỏi của người dùng. Trả về kết quả dưới dạng JSON hợp lệ, không thêm giải thích."
                    },
                    {
                        "role": "user",
                        "content": f"""
                        Tôi cần tìm kiếm sản phẩm trong MongoDB. Dưới đây là thông tin cấu trúc của dữ liệu:

                        {structure}

                        Yêu cầu truy vấn: "{query}"

                        Hãy sinh ra MongoDB query, dưới dạng JSON thuần, không cần giải thích hoặc thêm bất kỳ mô tả nào.
                        Query gồm, nếu có yêu cầu: 
                        - filter
                        - sort
                        - limit
                        """
                    }
                ]
            )
        response = response.choices[0].message.content.replace("```json", "").replace("```", "").strip()
        print("Response from OpenAI:", response)
        query_data = json.loads(response)
        filter_query = query_data.get("filter", {})
        sort_query = query_data.get("sort", None)
        limit_query = query_data.get("limit", 10)
        cursor = products_collection.find(filter_query)
        if sort_query:
            cursor = cursor.sort(sort_query)
        cursor = cursor.limit(limit_query)
        result = cursor
        message = f"Đây là các sản phẩm phù hợp với yêu cầu của bạn: "
        list_products = []
        for product in result:
            id = str(product["_id"])
            title = product["title"]
            category = product["category"]
            price = "{:,}".format(product["price"]).replace(",", ".")
            url = rf"{base_url}/{category.lower()}/{id}/{title.replace(' ','%20')}"
            list_products.append(
                f"- <a href='{url}'>{category} - {title}: {price} VNĐ</a>"
            )
        list_products_str = "\n".join(list_products)
        return jsonify({
            "message": message,
            "products": list_products_str
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)

    #  .\venv\Scripts\activate
    # python .\api.py