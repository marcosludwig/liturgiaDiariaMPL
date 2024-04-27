// carrega o datepicker com a data de hoje.
var data = new Date();
var dia = String(data.getDate()).padStart(2, '0');
var mes = String(data.getMonth() + 1).padStart(2, '0');
var ano = data.getFullYear();

if (typeof myDate !== 'undefined')
  myDate.value = ano + '-' + mes + '-' + dia;

const apiUrl = 'https://liturgiadiaria.site';

let bIsIndex = false;
if (window.location.pathname.endsWith('index.html')) {
  localStorage.clear();
  bIsIndex = true;
}

var strData = localStorage.getItem('dataLiturgiaDiaria');

if (bIsIndex || strData === null || strData === "") {

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      insertDataIntoHTML(data);
      localStorage.setItem('dataLiturgiaDiaria', JSON.stringify(data));
    })
    .catch(error => { console.error('Error fetching data:', error); });
}
else {
  var dataLiturgiaDiaria = JSON.parse(strData);
  insertDataIntoHTML(dataLiturgiaDiaria);
}

function insertDataIntoHTML(data) {
  const dataKeys = Object.keys(data);

  for (const key of dataKeys) {
    const sectionElement = document.getElementById(key);
    const textContent = data[key];

    if (sectionElement) {
      if (key === 'data') {
        sectionElement.innerHTML = `<h2>Liturgia do dia ${textContent}</h2>`;
      }
      if (key === 'liturgia') {
        sectionElement.innerHTML = `<p>${textContent}</p>`;
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
          sectionElement.innerHTML = `
              <h2>Segunda leitura</h2>
              <p>Não há segunda leitura!</p>
            `;
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

function changeDate()
{
  var x = document.getElementById("myDate").value;
  if (x === '')
  {
    alert("Insira uma data válida");
    return;
  }

  var dataNew = new Date(x);
  // Ajuste para o fuso horário local
  dataNew.setMinutes(dataNew.getMinutes() + dataNew.getTimezoneOffset());

  var dayNew = String(dataNew.getDate()).padStart(2, '0');
  var monthNew = String(dataNew.getMonth() + 1).padStart(2, '0');
  
  const apiUrlByDate = apiUrl + '/' + dayNew + '-' +  monthNew;

  fetch(apiUrlByDate)
    .then(response => response.json())
    .then(data => {
      if (typeof data.erro !== 'undefined') {
        if (data.erro != "") {
          alert("Erro retornado pela API: " + data.erro);
        }
      }
      else if (typeof data.aviso === 'undefined') {
        alert("Servidor retornou uma estrutura desconhecida"); 
      }
      else if (data.aviso !== "") {
        insertDataIntoHTML(data);
        localStorage.setItem('dataLiturgiaDiaria', JSON.stringify(data));
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      alert("Servidor retornou erro");
    });
} 