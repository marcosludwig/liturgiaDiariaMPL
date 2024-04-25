const apiUrl = 'https://liturgiadiaria.site';

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    insertDataIntoHTML(data);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

function insertDataIntoHTML(data) {
  const dataKeys = Object.keys(data);

  for (const key of dataKeys) {
    const sectionElement = document.getElementById(key);
    const textContent = data[key];

    if (sectionElement) {
      if (key === 'data') {
        sectionElement.innerHTML = `<h2>Liturgia do dia ${textContent}</h2>`;
      }
      else if (key === 'cor') {
        sectionElement.innerHTML = `<p>Cor litúrgica: ${textContent}</p>`;
      }
      else if (key === 'salmo') {
        const referencia = data.salmo.referencia;
        const refrao = "<p><b>— " + data.salmo.refrao + "</p></b>";
        const texto = data.salmo.texto;
        let subStrings = texto.split('—');
        let novoTexto = "";
        for (let i = 1; i < subStrings.length; i++) {
          if (i != 1) {
            novoTexto += "</p>";
          }

          novoTexto += `<p>${subStrings[i]}</p>${refrao}`;
          if (i < subStrings.length - 1) {
            novoTexto += "<p>";
          }
        }

        sectionElement.innerHTML = `
            <h2>Salmo responsorial (${referencia})</h2>
            ${novoTexto}
          `;
      }
      else if (key === 'primeiraLeitura') {
        const texto = data.primeiraLeitura.texto;
        const referencia = data.primeiraLeitura.referencia;

        sectionElement.innerHTML = `
            <h2>Primeira leitura (${referencia})</h2>
            <p>${texto}</p>
          `;
      }
      else if (key === 'segundaLeitura') {
        const texto = data.segundaLeitura.texto;

        if (texto === undefined) {
          /* se não há segunda leitura, deixa vazio*/
        }
        else {
          const referencia = data.primeiraLeitura.referencia;
          sectionElement.innerHTML = `
              <h2>Segunda leitura (${referencia})</h2>
              <p>${texto}</p>
            `;
        }
      }
      else if (key === 'evangelho') {
        const texto = data.evangelho.texto;
        const referencia = data.evangelho.referencia;

        sectionElement.innerHTML = `
            <h2>Evangelho (${referencia})</h2>
            <p>${texto}</p>
          `;
      }
      else {
        /* demais keys não serão suportadas */
      }
    }
  }
}