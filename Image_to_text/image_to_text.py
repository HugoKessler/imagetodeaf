import requests
import json
from io import BytesIO
from PIL import Image
from IPython.display import display
from google.colab import files
import urllib.request
import io
import openai
import base64p
from flask import Flask, request, jsonify, send_file

app = Flask(__name__)
@app.route('/text', methods=['POST'])



def image_text(image):

    
    # Use the files.upload() function to upload an image


    # Set the OpenAI API credentials
    openai.api_key = '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'

    prompt = f"Please write a caption for this image: {image}"
    model_engine = "text-davinci-002"
    params = {
        "prompt": prompt,
        "max_tokens": 1024,
        "temperature": 0.5,
        "n": 1,
        "stop": None,
    }

    # Send the API request and get the response
    response = openai.Completion.create(engine=model_engine, prompt=prompt, max_tokens=params['max_tokens'], temperature=params['temperature'], n=params['n'], stop=params['stop'])

    # Get the generated caption from the response
    caption = response.choices[0].text.strip()

  # Print the image caption
    return caption

if __name__ == '__main__':
    app.run()

