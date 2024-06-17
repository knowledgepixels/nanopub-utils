Build:

    $ yarn build

Upload to our server for testing:

    $ scp build/dist/lib/nanopub-utils.js tk@a.knowledgepixels.com:/var/www/nginx/js/

Test in HTML:

    <!DOCTYPE html>
    <html lang="en-US">
      <head><meta charset="utf-8" /><title>Testing Nanopub JS</title></head>
      <body>
        <script type="module">
          import { getUpdateStatus } from "https://a.knowledgepixels.com/js/nanopub-utils.js";
          getUpdateStatus("status", "https://w3id.org/np/RADHta9ivZ3boxjiHZcEtcKpnid_F07GUOnTBgBquE7jo");
        </script>
        <p><span id="status"><em>Checking for updates...</em></span></p>
      </body>
    </html>

Test second-generation queries:

    <!DOCTYPE html>
    <html lang="en-US">
      <head><meta charset="utf-8" /><title>Testing Nanopub JS</title></head>
      <body>
        <script type="module">
          import { query } from "https://a.knowledgepixels.com/js/nanopub-utils.js";
          query("RA08cTBCfz8zVRdxeIR6ps1h3k_dSddXTnxCKc24rBT5A", "get-3pff-events", (bindings) => {
            for (const b of bindings) {
              var list = document.getElementById("list");
              var item = document.createElement("li");
              item.appendChild(document.createTextNode(b['eventName']['value']));
              list.appendChild(item);
            }
          } );
        </script>
        <ul id="list"></ul>
      </body>
    </html>
