import time
import os
from gtts import gTTS
from pygame import mixer 
from mutagen.mp3 import MP3
from flask import Flask, request, jsonify, send_file

app = Flask(__name__)

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

if __name__ == '__main__':
    app.run()
