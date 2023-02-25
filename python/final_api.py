from io import BytesIO
from PIL import Image
import openai
import base64
import flask
from flask import Flask, request, jsonify, send_file
import time
import os
from gtts import gTTS
from pygame import mixer 
from mutagen.mp3 import MP3
import json

app = Flask(__name__)

openai.api_key = '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'

@app.route('/image', methods=['POST'])
def image_text():

    data = request.get_json()
    image = data['image']

    # Use the files.upload() function to upload an image
    # Set the OpenAI API credentials
    img =  decode_base64_to_image(image)

    prompt = f"Please write a caption for this image: {img}"
    model_engine = "text-davinci-003"
    params = {
        "prompt": prompt,
        "input": {},
        "max_tokens": 1024,
        "temperature": 0.5,
        "n": 1,
        "stop": None,
    }

    # Send the API request and get the response
    response = openai.Completion.create(engine=model_engine, prompt=prompt, max_tokens=params['max_tokens'], temperature=params['temperature'], n=params['n'], stop=params['stop'])
    
    # Get the generated caption from the response
    caption = response.choices[0].text.strip()
    output_str = generate_output(caption)

    # Print the image caption
    return output_str

def decode_base64_to_image(base64_string):
    # Split the input string into the format and base64 data parts
    format, data = base64_string.split(';base64,')
    # Extract the image format from the format string
    image_format = format.split('/')[-1]
    # Decode the base64 data
    img_data = base64.b64decode(data)
    # Create a PIL Image object from the decoded data
    img = Image.open(BytesIO(img_data))
    # Save the image in the specified format
    with open('decoded_image.' + image_format, 'wb') as f:
        f.write(img_data)
    return 'decoded_image.' + image_format

def generate_output(caption):
    output = {
        "success": "true",
        "data": {
            "caption": caption.replace('"', '')
        }
    }
    return json.dumps(output)

@app.route('/audio', methods=['POST'])
def convert_text_to_audio():
    # Get the input text from the request
    data = request.get_json()
    text = data['text']
    
    # Create a gTTS object and specify the language
    tts = gTTS(text=text, lang='en')

    # Generate a unique filename based on the current timestamp
    filename = str(int(time.time())) + '.mp3'
    output_path = os.path.join('./', filename)

    # Save the audio file
    tts.save(output_path)

    # Return the length of the audio file as a JSON response
    return send_file(output_path, mimetype='audio/mpeg')


@app.route('/summary', methods=['POST'])
def generate_summary():
    # Parse request payload
    data = request.get_json()
    text = data['text']
    tokens_amount = data['tokens_amount']
    
    # Concatenate text into single string
    input_text = ' '.join(text)
    
    # Generate summary using OpenAI's GPT-3
    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=input_text,
        max_tokens=tokens_amount,
        n=1,
        stop=None,
        temperature=0.5,
    )
    summary = response.choices[0].text.strip()
    
    # Return summary as JSON response
    return jsonify({
        "success": True,
        "data": {
            "summary": summary
        }
    })

if __name__ == '__main__':
    app.run()