// Helper function to convert the stream to an audio buffer
export type AudioBuffer = Buffer;

export const getAudioBuffer = async (response: ReadableStream<Uint8Array>): Promise<AudioBuffer> => {
  const reader = response.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    chunks.push(value);
  }

  const dataArray = chunks.reduce((acc, chunk) => Uint8Array.from([...acc, ...chunk]), new Uint8Array(0));

  return Buffer.from(dataArray.buffer);
};
