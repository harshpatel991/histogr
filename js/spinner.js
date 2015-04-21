function Spinner() {};
Spinner.show = function(){
        var spinHtml = '<div class="pgloading"> \
                            <div class="loadingwrap"> \
                                <ul class="bokeh"> \
                                    <li></li> \
                                    <li></li> \
                                    <li></li> \
                                    <li></li> \
                                </ul> \
                            </div> \
                        </div>';

        $('#load-spinner').html(spinHtml);
    };

Spinner.hide = function(){
        $('#load-spinner').html('');
    };