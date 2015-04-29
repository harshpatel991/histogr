function CustomColors(){}

CustomColors.trigger = '#9253a0';
CustomColors.regular = '#3e79d6';
CustomColors.distraction = '#F2517F';

CustomColors.getTypeColor = function(type){
    if (type == 'trigger'){
        return CustomColors.trigger;
    }
    else if (type == 'distraction'){
        return CustomColors.distraction;
    }
    else{
        return CustomColors.regular;
    }
};