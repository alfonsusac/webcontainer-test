"use client"

import { useEffect, useRef, useState } from "react"
import { WebContainer } from '@webcontainer/api'
import { toast } from "sonner"
import { Terminal } from 'xterm'
import 'xterm/css/xterm.css';



let webcontainerInstance: WebContainer
let ignore = false


export default function WebContainerComponent() {

  const [input, setInput] = useState(files['index.js'].file.contents)


  const inputRef = useRef<HTMLTextAreaElement>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  async function initialize() {
    toast.loading("Initializing WebContainer")

    try {
      const terminal = new Terminal({
        convertEol: true,
      })
      terminal?.open(terminalRef.current!);

      // Call only once
      webcontainerInstance = await WebContainer.boot()
      await webcontainerInstance.mount(files)

      const exitCode = await installDeps(terminal);
      if (exitCode !== 0) {
        toast.error("Dependency Installation Failed")
        return
      }

      startDevServer(terminal);

    } catch (error: any) {
      if (!(error.message as string).includes('single')) {
        toast.error("Unknown Error Occured")
        console.log(error)
        throw error
      }
    }
    //test
    // const packageJSON = await webcontainerInstance.fs.readFile('package.json', 'utf-8')
    // console.log(packageJSON)
    toast.success("Initializing done")
  }

  async function installDeps(terminal?: Terminal) {
    const installProcess = await webcontainerInstance.spawn('pnpm', ['install'])
    installProcess.output.pipeTo(new WritableStream({
      write(data) {
        terminal?.write(data);
        // toast.info(data)
      }
    }))
    return installProcess.exit;
  }

  async function startDevServer(terminal?: Terminal) {
    // toast.loading('Running Dev Server')
    const serverProcess = await webcontainerInstance.spawn('pnpm', ['run', 'start'])
    serverProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          terminal?.write(data)
        }
      })
    )
    webcontainerInstance.on('server-ready', (port, url) => {
      // toast.success('Server Ready')
      if (frameRef.current) {
        frameRef.current.src = url
      }
    });
  }

  async function writeIndexJS(content: string) {
    await webcontainerInstance?.fs.writeFile('/index.js', content)
  }


  // ah yes, we meet again use effect
  const ref = useRef(false)
  useEffect(() => {
    if (ref.current) {
      initialize()
    }
    return () => {
      ref.current = true
    }
  }, [])

  useEffect(() => {
    writeIndexJS(input)
  },[input])



  return (
    <>
      <div className="editor px-0 bg-[#222]">
        <textarea
          ref={inputRef}
          className="px-8 h-64 pb-0"
          wrap="off"
          value={input}
          onChange={(e)=>setInput(e.target.value)}
        />
      </div>
      <div className="preview mt-4 px-0">
        <iframe
          ref={frameRef}
          className="px-8 bg-white w-full h-64"
          src="loading.html"></iframe>
      </div>
      <div className="terminal bg-black mt-4" ref={terminalRef} />
    </>
  )
}


const files = {
  'index.js': {
    file: {
      contents: `import express from 'express';
const app = express();
const port = 3111;

app.get('/', (req, res) => {
  res.send('Welcome to a WebContainers app! 🥳');
});

app.listen(port, () => {
  console.log(\`App is live at http://localhost:\${port}\`);
});`,
    },
  },
  'package.json': {
    file: {
      contents: `
{
  "name": "example-app",
  "type": "module",
  "dependencies": {
    "express": "latest",
    "nodemon": "latest"
  },
  "scripts": {
    "start": "nodemon --watch './' index.js"
  }
}`,
    },
  },
}