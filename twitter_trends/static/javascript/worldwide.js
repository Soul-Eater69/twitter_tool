
    fetchWorldTrends();
    
    const row_tag = document.getElementById('response-table');
    const input = document.getElementById('search-item');
    const loader = document.getElementById('loader');
    var location_tag = document.getElementById('location_span');
    

    var file = [];
    var sort_flag = 0;

    loader.style.display = 'none'
    
    const toggle = ()=>{
        
        let response = document.getElementById('row_con');
        var x = document.getElementById("response-table");
        x.classList.toggle('active');
        //x.style.display = "none";
        //x.style.visibility = "hidden";
        let popup = document.getElementById('pop-up');
        popup.classList.toggle('active');
    };

    input.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("search-btn").click();
        }
    });
    
    const get_excel_data_list = (file)=>{
        const data = [file.map((e,i)=>{
            return new Array(i+1,e.name,e.tweet_volume);
        })];
        return data
    
    }

    async function fetchWorldTrends() {

        loader.style.display = 'block'
        row_tag.innerHTML = '';
        let response = await fetch('https://twitter-trends-api-deepawali.herokuapp.com/trends/worldwide');
        let data = await response.json();

        loader.style.display = 'none'
        let trend_data = data['data'][0]['trends']; 
        list_items(trend_data);
        file = trend_data;

    }

    const list_items = (items)=>{
        let nf = new Intl.NumberFormat('en-us');
        const html_items = items.map((e,i) => {
            return  `<li class="table-row">
                        <div class="col col-1" data-label="Rank">${i+1}</div>
                        <div class="col col-2" data-label="Hashtag"><i class="fa-solid fa-hashtag" ></i>${e.name.replace("#",'')}</div>
                        <div class="col col-3" data-label="Volume">${e.tweet_volume==null || e.tweet_volume==0?"Less than 10k":nf.format(e.tweet_volume)}</div>
                        <div class="col col-4" data-label=""><button type="button" id="search-btn" class="btn btn-dark" onclick="toggle()">Details</button></div>
                    </li>`
        }).join('\n');
        
        const first_tag = `<li class="table-header">
                    <div class="col col-1">Rank</div>
                    <div class="col col-2">Hashtag</div>
                    <div class="col col-3"><i class="fa-solid fa-sort" onclick="fetchSorted()"></i>Volume</div>
                    <div class="col col-4"><i class="fas fa-file-download" onclick="get_excel()"></i></div>
                  </li>`;
        row_tag.innerHTML = first_tag+html_items;
    }



    function get_excel(){
        console.log("clicl")
        var ns = XLSX.utils.book_new();
        ns.props = {
            title: "new excell sheet",
            subject: "data",
            Auther: "deepawali",
            createdDate: Date.now(),
        };
        ns.SheetNames.push("Sheet-1");
        var nb_data = get_excel_data_list(file)[0];
        
        var nb = XLSX.utils.aoa_to_sheet(nb_data);
        ns.Sheets["Sheet-1"] = nb;

        var nbOut = XLSX.write(ns, { bookType: "xlsx", type: "binary" });
        saveAs(
          new Blob([saveBook(nbOut)], { type: "application/octet-stream" }),
          "test.xlsx"
        );
    }
    

      function saveBook(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i < s.length; i++) {
          view[i] = s.charCodeAt(i) & 0xff;
        }
        return buf;
      }
