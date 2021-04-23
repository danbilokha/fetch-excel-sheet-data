const contentTmpl = document.getElementById('content');

          function isObjEmpty(obj) {
              return !obj || Object.keys(obj).length === 0
          }

          function updateTitle(title) {
            document.title = title;
          }

          function updateContent(parsedRowsData) {
                let innerHtml = '';

                parsedRowsData.forEach((parsedRowData) => {
                    const [title, ...content] = parsedRowData;
                    console.log(title, content);

                    // innerHtml += `<h2 class='title'>${title}</h2>${content.reduce((acc, curr) => `${acc}<p class='text'>${curr}</p>`, '')}`
                    innerHtml += `<h2 class='title'>${title}</h2><p class='text'>${content.join(',')}</p>`
                })

                contentTmpl.innerHTML = innerHtml;
          }

        function reqListener({currentTarget}) {
            const result = JSON.parse(currentTarget.responseText);
            const {properties: {title}, sheets} = result;

            updateTitle(title);

            const [firstSheet] =sheets;
            const rowsData = firstSheet.data[0].rowData;

            const parsedRowsData = [];

            rowsData.forEach((rowData) => {
                let parsedRowData = [];
                const {values} = rowData;

                if(isObjEmpty(values)) {
                    return;
                }

                values.forEach(columnData => {
                    if(isObjEmpty(columnData)) {
                        return;
                    }

                    const {formattedValue} = columnData;


                    if(isObjEmpty(formattedValue)) {
                        return;
                    }

                    parsedRowData.push(formattedValue);
                })

                if(parsedRowData.length > 0) {
                    parsedRowsData.push(parsedRowData);
                }
            })

            updateContent(parsedRowsData);
        }

        function getData() {
          var oReq = new XMLHttpRequest();
          oReq.addEventListener("load", (req) => reqListener(req));
          oReq.open(
            "GET",
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREAD_ID}/?key=${API_KEY}&includeGridData=true`
          );
          oReq.send();
        }

        const API_KEY = "AIzaSyDg3zwVvILoTDSI-rWXNVlkjGXW9vt02fw";
        const SPREAD_ID = "1dWi1r-fhY1XibL7hGLVQYhtBgpKRuVGrGUwFL5PhTUU";

        getData();
        setInterval(() => getData(), 50000);