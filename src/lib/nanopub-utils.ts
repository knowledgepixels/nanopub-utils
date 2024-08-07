/* eslint-disable functional/immutable-data */

// ----------
//
// For first-generation services:

export const grlcNpApiUrls = [
  'https://grlc.nps.knowledgepixels.com/api/local/local/',
  'https://grlc.services.np.trustyuri.net/api/local/local/'
];

export const getUpdateStatus = (elementId: string, npUri: string) => {
  document.getElementById(elementId).innerHTML = '<em>Checking for updates...</em>';
  const shuffledApiUrls = [...grlcNpApiUrls].sort(() => 0.5 - Math.random());
  getUpdateStatusX(elementId, npUri, shuffledApiUrls);
};

const getUpdateStatusX = (elementId: string, npUri: string, apiUrls) => {
  if (apiUrls.length == 0) {
    const h: HTMLElement = document.getElementById(elementId) as HTMLInputElement;
    h.innerHTML = '<em>An error has occurred while checking for updates.</en>';
    return;
  }
  const apiUrl = apiUrls.shift();
  const requestUrl = apiUrl + '/get_latest_version?np=' + npUri;
  const r = new XMLHttpRequest();
  r.open('GET', requestUrl, true);
  r.setRequestHeader('Accept', 'application/json');
  r.responseType = 'json';
  r.onload = function () {
    // eslint-disable-next-line functional/no-let
    let h = '';
    if (r.status == 200) {
      const bindings = r.response['results']['bindings'];
      if (bindings.length == 1 && bindings[0]['latest']['value'] === npUri) {
        h = 'This is the latest version.';
      } else if (bindings.length == 0) {
        h = 'This nanopublication has been <strong>retracted</strong>.';
      } else {
        h = 'This nanopublication has a <strong>newer version</strong>: ';
        if (bindings.length > 1) {
          h = 'This nanopublication has <strong>newer versions</strong>: ';
        }
        // eslint-disable-next-line functional/no-loop-statement
        for (const b of bindings) {
          const l = b['latest']['value'];
          h += ' <code><a href="' + l + '">' + l + '</a></code>';
        }
      }
      document.getElementById(elementId).innerHTML = h;
    } else {
      getUpdateStatusX(elementId, npUri, apiUrls);
    }
  };
  r.onerror = function () {
    getUpdateStatusX(elementId, npUri, apiUrls);
  };
  r.send();
};

export const getLatestNp = callback => {
  fetch('https://server.np.trustyuri.net/nanopubs.txt')
    .then(response => response.text())
    .then(data => {
      const lines = data.split(/\n/);
      callback(lines[lines.length - 2]);
    });
};

// ----------
//
// For second-generation services:

export const queryServers = [
  'https://query.knowledgepixels.com/', 'https://query.np.kpxl.org/', 'https://query.np.trustyuri.net/'
];

export const query = (queryId: string, template, params = {}) => {
  const shuffledQueryServers = [...queryServers].sort(() => 0.5 - Math.random());
  queryX(queryId, shuffledQueryServers, template, params);
}

export const nanopubIconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" width="8pt"><path d="M5,8H8L3,0H0M8,4.8V0H5M0,3.2V8H3"/></svg>'

const queryX = (queryId: string, queryServerList, template, params) => {
  if (queryServerList.length == 0) {
    // TODO
    return;
  }
  const queryServer = queryServerList.shift();
  const specCode = queryId.split("/")[0];
  const queryName = queryId.split("/")[1];
  const requestUrl = queryServer + 'api/' + specCode + '/' + queryName;
  const r = new XMLHttpRequest();
  // eslint-disable-next-line no-var
  var paramStr = '?';
  // eslint-disable-next-line functional/no-loop-statement, no-var
  for (var p in params) {
    paramStr = paramStr + '&' + encodeURIComponent(p) + '=' + encodeURIComponent(params[p]);
  }
  r.open('GET', requestUrl + paramStr, true);
  r.setRequestHeader('Accept', 'application/json');
  r.responseType = 'json';
  r.onload = function () {
    if (r.status == 200) {
      template.parentNode.querySelectorAll('.nps_temp').forEach(c => c.outerHTML = '');
      const bindings = r.response['results']['bindings'];
      bindings.forEach( b => {
        const el = template.content.cloneNode(true);
        [...el.querySelectorAll('[nps_innerText]')].forEach(e => {
          if (b[e.getAttribute('nps_innerText')]) {
            e.innerText = b[e.getAttribute('nps_innerText')]['value'];
          }
        });
        [...el.querySelectorAll('[nps_user]')].forEach(e => {
          if (b[e.getAttribute('nps_user')]) {
            setName(b[e.getAttribute('nps_user')]['value'], e);
          }
        });
        [...el.querySelectorAll('[nps_attribute]')].forEach(e => {
          if (b[e.getAttribute('nps_attribute').split("=")[1]]) {
            e.setAttribute(e.getAttribute('nps_attribute').split("=")[0], b[e.getAttribute('nps_attribute').split("=")[1]]['value']);
          }
        });
        [...el.querySelectorAll('span.nanopub_icon')].forEach(e => e.outerHTML = nanopubIconSvg);
        template.parentNode.appendChild(el);
      });
    } else {
      queryX(queryId, queryServerList, template, params);
    }
  };
  r.onerror = function () {
    // TODO
  };
  r.send();
}

const setName = (userId: string, element) => {
  element.innerText = userId;
  element.setAttribute("href", userId);
  // TODO make sure same ID is only queried once and result cached
  const r = new XMLHttpRequest();
  // TODO try different Nanodash instances
  r.open('GET', "https://nanodash.knowledgepixels.com/get-name?id=" + userId, true);
  r.onload = function () {
    if (r.status == 200) {
      element.innerText = r.responseText;
    }
  };
  r.send();
}


// ----------