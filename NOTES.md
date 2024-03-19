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

