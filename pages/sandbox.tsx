// This is the HTML content of the sandbox iframe that executes code
export default function Sandbox(){
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>SimplyCode Sandbox</title>
        <meta name="robots" content="noindex, nofollow" />
        <style>{`
          body { font-family: system-ui, sans-serif; margin: 1rem; }
          .output { font-family: ui-monospace, monospace; white-space: pre-wrap; }
          .error { color: #d63163; }
        `}</style>
      </head>
      <body>
        <div id="output"></div>
        <script dangerouslySetInnerHTML={{ __html: `
          const output = document.getElementById('output')
          
          // capture console output
          const log = console.log
          const error = console.error
          console.log = (...args) => {
            log(...args)
            output.innerHTML += '<div class="output">' + args.join(' ') + '</div>'
          }
          console.error = (...args) => {
            error(...args)
            output.innerHTML += '<div class="output error">' + args.join(' ') + '</div>'
          }

          // listen for messages from parent
          window.addEventListener('message', (e) => {
            if(e.data.type === 'run'){
              output.innerHTML = ''
              try{
                const fn = new Function(e.data.code)
                fn()
              }catch(err){
                console.error(err.toString())
              }
            }
            if(e.data.type === 'reset'){
              output.innerHTML = ''
              document.body.innerHTML = '<div id="output"></div>'
            }
          })

          // tell parent we're ready
          window.parent.postMessage('sandbox:ready', '*')
        ` }} />
      </body>
    </html>
  )
}