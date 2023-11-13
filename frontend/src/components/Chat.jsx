import { useState, useRef } from "react";

function Chat() {

  const [transcript, setTranscript] = useState(null);
  const inputTextRef = useRef(null);

  async function handleUploadQuestion(){

    if (inputTextRef.current) {
      const inputText = inputTextRef.current.value;

      try {

        const response = await fetch('http://127.0.0.1:8000/chat', {
          method: "POST",
          body: JSON.stringify({ text: inputText }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const reader = response.body.getReader();

        async function processStream({ done, value }){
          if (done) {
            return;
          }

          const chunk = new TextDecoder("utf-8").decode(value);
          setTranscript((prevData) => [...prevData, chunk]);
          return reader.read().then(processStream);
        };

        setTranscript([]);
        reader.read().then(processStream);
      } catch (error) {
        console.error('Error:', error);
      }

    }
  };

  return (
    <>
      <div>
        <textarea
          rows={5}
          cols={50}
          ref={inputTextRef}
        />
      </div>
      <button onClick={handleUploadQuestion}>Enviar</button>

      {transcript && (
        <div>
          <h2>{inputTextRef.current?.value}</h2>
          {transcript.join("")}
        </div>
      )}
    </>
  );
};

export default Chat;