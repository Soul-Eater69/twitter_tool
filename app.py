from time import thread_time_ns
from twitter_trends import app,views

if "__main__"==__name__:
    app.run(debug=True,use_reloader = True)
