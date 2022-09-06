from itertools import count
import re
from flask import render_template,request,flash,redirect,url_for
from twitter_trends import app
from twitter_trends.utility import convert_to_excel
import requests,os
import tweepy
import geocoder
import json
from dotenv import load_dotenv
from flask_caching import Cache

cache = Cache(config={'CACHE_TYPE': 'SimpleCache',
                      "CACHE_THRESHOLD": 500})

cache.init_app(app)

load_dotenv()

auth = tweepy.OAuthHandler(os.getenv('auth_1'), os.getenv('auth_2'))
auth.set_access_token(os.getenv('access_token_1'), os.getenv('access_token_2'))
api_obj = tweepy.API(auth)

SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
json_url = os.path.join(SITE_ROOT, "static/data", "locations.json")
data = json.load(open(json_url))
sorted_data = sorted(data.items(),key= lambda x:x[0])
sorted_data = sorted_data[1:]

@app.route("/")
@cache.cached(timeout=1800)
def index():
    trends = api_obj.get_place_trends(1)
    trends = trends[0]['trends']
    excel_data = convert_to_excel(trends)
    
    return render_template("index.html",data=trends,excel_data=excel_data,location_list = sorted_data,country=False,city=False,city_flag=False,data_flag=True)


@app.route("/<string:location>",methods=['POST','GET'])
@cache.cached(timeout=1800)
def country_specific(location):
    for i in data:
        if i==location:
            id = data[i][0]
            break
    try:
        trends = api_obj.get_place_trends(id)
        trends = trends[0]['trends']
        excel_data = convert_to_excel(trends)
        cities = []
        
        for i in data:
            if i==location:
                cities = data[location][2]['cities']
                break
        
        return render_template("index.html",data=trends,excel_data=excel_data,location_list = sorted_data,country=location,city=False,city_flag=True,cities=cities,data_flag=True)

    except:
        return render_template("index.html",data_flag=False)



@app.route("/<string:country>/<string:city>")
@cache.cached(timeout=1800)
def city_specific(country,city):
    for i in data:
        if i==country:
            for j in data[i][2]['cities']:
                if j[0]==city:
                    id = j[1]
                    break
    
    cities = []

    for i in data:
        if i==country:
            cities = data[country][2]['cities']
            break
    
    try:
        trends = api_obj.get_place_trends(id)
        trends = trends[0]['trends']
        excel_data = convert_to_excel(trends)
        
        return render_template("index.html",data=trends,excel_data=excel_data,location_list = sorted_data,city=city,country=country,city_flag=True,cities=cities,data_flag=True)
    except:
        return render_template("index.html",data_flag=False)




@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404