from csv import excel


def convert_to_excel(trends):
    excel_data = []
    rank = 1
    for i in trends:
        if i['tweet_volume']==None:
            excel_data.append([rank,i['name'].replace("#","").strip().replace("\n",""),"Less than 10K"])
        else:
            excel_data.append([rank,i['name'].replace("#","").strip().replace("\n",""),i['tweet_volume']])
        rank+=1
    
    return excel_data


def get_cities(country,trends):
    pass
