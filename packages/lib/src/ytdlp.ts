import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

export async function downloadAudio(videoId: string): Promise<string> {
  const outputPath = path.join('/tmp', `${videoId}.mp3`);
  
  // Check if file already exists
  if (fs.existsSync(outputPath)) {
    return outputPath;
  }
  
  // Download audio using yt-dlp
  await execAsync(
    `yt-dlp -f 'ba' -x --audio-format mp3 --audio-quality 128K ` +
    `--output "${outputPath}" https://www.youtube.com/watch?v=${videoId}`
  );
  
  return outputPath;
}
