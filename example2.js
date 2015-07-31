var colorHash = function(x){
    var chaos = (x % 1000) / 1000;
    for (i = 1; i < 5; ++i){
        chaos = 3.9 * chaos * (1 - chaos)
    }
    hash = chaos.toString().split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
    var r = (hash & 0xFF0000) >> 16;
    var g = (hash & 0x00FF00) >> 8;
    var b = hash & 0x0000FF;
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

var TableBody = React.createClass({displayName: "TableBody",
    getInitialState: function() {
        return {
            shouldUpdate: true,
            firstRenderedPixel: 0,
            lastRenderedPixel: 0,
        };
    },

    componentWillReceiveProps: function(nextProps) {
        var shouldUpdate = nextProps.firstRenderedPixel != this.state.firstRenderedPixel
                        || nextProps.lastRenderedPixel != this.state.lastRenderedPixel;

        if (shouldUpdate) {
            this.setState({
                shouldUpdate: shouldUpdate,
                firstRenderedPixel: nextProps.firstRenderedPixel,
                lastRenderedPixel: nextProps.lastRenderedPixel,
            });
        } else {
            this.setState({shouldUpdate: false});
        }
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return this.state.shouldUpdate;
    },

    render: function(){
        var rowHeight = 50;
        var borderPx = 0;
        var tdStyle = {border: borderPx + 'px solid white', width: '50%', background: '#CCCCCC'};
        var trStyle = {height: rowHeight + 'px'};

        var rows = []

        var leftDepth = 0,
            rightDepth = 0,
            leftOverhang = 0,
            rightOverhang = 0;

        var i = 0;
        while (i < this.props.items.length && Math.min(leftDepth, rightDepth) < this.props.lastRenderedPixel){
            var itemList = this.props.items[i];
            var row;
            if (itemList.length == 0){
                if (leftOverhang > 0) {leftOverhang -= 1;}
                if (rightOverhang > 0) { rightOverhang -= 1;}
                row = "";
            } else if (itemList.length == 1){
                var item = itemList[0];
                var body;
                if (leftDepth <= rightDepth){
                    leftDepth += item * (borderPx + rowHeight + 1) - 2;
                    leftOverhang = item - 1;
                    body = leftDepth;
                } else {
                    rightDepth += item * (borderPx + rowHeight + 1) - 2;
                    rightOverhang = item - 1;
                    body = rightDepth;
                }
                var myStyle = {border: borderPx + 'px solid white', width: '50%', background: colorHash(body)};
                row = (React.createElement("td", {style: myStyle, rowSpan: item}, body));
            } else {
                item1 = itemList[0];
                leftDepth += item1 * (borderPx + rowHeight + 1) - 2;
                leftOverhang = item1 - 1;
                item2 = itemList[1];
                rightDepth += item2 * (borderPx + rowHeight + 1) - 2;
                rightOverhang = item2 - 1;
                var leftStyle = {border: borderPx + 'px solid white', width: '50%', background: colorHash(leftDepth)};
                var rightStyle = {border: borderPx + 'px solid white', width: '50%', background: colorHash(rightDepth)};
                row = (React.createElement("div", null, React.createElement("td", {style: leftStyle, rowSpan: item1}, leftDepth), React.createElement("td", {style: rightStyle, rowSpan: item2}, rightDepth)));
            }
            if (Math.max(leftDepth, rightDepth) > this.props.firstRenderedPixel){
                rows.push(
                    (React.createElement("tr", {style: trStyle, key: i}, row))
                );
            }
            i++;
            if (i >= this.props.items.length){
                console.log("Oh no! We've run out of items!");
            }
        }
        // console.log("With a LRP of %d, we rendered up to pixels (%d, %d)", this.props.lastRenderedPixel, leftDepth, rightDepth);
        return(
            React.createElement("table", {cellspacing: "0", style: {width: '100%', borderCollapse: 'collapse'}}, 
                React.createElement("tbody", null, rows)
            )
        );
        
    }
});

var InfiniteTable = React.createClass({displayName: "InfiniteTable",
    getInitialState: function(){
        return {
            firstRenderedPixel: 0,
            lastRenderedPixel: 5000,
        };
    },

    onScroll: function(event) {
        scrollable = this.refs.scrollable.getDOMNode();
        height = parseFloat(scrollable.style.height);
        scrollTop = scrollable.scrollTop;
        scrollHeight = scrollable.scrollHeight;

        var newFirstRenderedPixel = this.state.firstRenderedPixel;
        var newLastRenderedPixel = this.state.lastRenderedPixel;

        if (scrollTop + 2 * height > scrollHeight) {
            // console.log("Triggering update because scrollTop + 2 * height > scrollHeight");
            this.setState({
                firstRenderedPixel: Math.max(0, this.state.lastRenderedPixel - 4000),
                lastRenderedPixel: this.state.lastRenderedPixel + 5000,
            });
        } else if (this.state.firstRenderedPixel > 0 && scrollTop < 2 * height){
            // console.log("Triggering update because scrollTop < 2 * height");
            this.setState({
                firstRenderedPixel: Math.max(0, this.state.firstRenderedPixel - 4000),
                lastRenderedPixel: this.state.firstRenderedPixel + 5000,
            });
        }
    },

    componentWillUpdate: function(){
        scrollable = this.refs.scrollable.getDOMNode();
        this.screenTop = this.state.firstRenderedPixel + scrollable.scrollTop;
        // console.log("Before update (screenTop, FRP, scrollTop) = (%d, %d, %d)", this.screenTop, this.state.firstRenderedPixel, scrollable.scrollTop);
    },

    componentDidUpdate: function(){
        // console.log("After update (screenTop, FRP, scrollTop) = (%d, %d, %d)", this.screenTop, this.state.firstRenderedPixel, scrollable.scrollTop);
        scrollable = this.refs.scrollable.getDOMNode();
        scrollable.scrollTop = this.screenTop - this.state.firstRenderedPixel;
        // console.log("After adjust (screenTop, FRP, scrollTop) = (%d, %d, %d)", this.screenTop, this.state.firstRenderedPixel, scrollable.scrollTop);
    },

    render: function() {
        return (
            React.createElement("div", {style: {'overflowX': 'hidden', 'overflowY': 'scroll', 'height': this.props.height}, ref: "scrollable", onScroll: this.onScroll}, 
                React.createElement(TableBody, {
                    firstRenderedPixel: this.state.firstRenderedPixel, 
                    lastRenderedPixel: this.state.lastRenderedPixel, 
                    items: this.props.items, 
                    height: this.props.height}
                )
            )
        );
    }
});

var items = [];
for (i = 0; i < 100000; i++){
    items.push([4, 5], [], [], [], [5], [2], [], [6], [], [3], [], [], [1]);
}

React.render(
    React.createElement(InfiniteTable, {
        items: items, 
        height: window.innerHeight}
    ),
    document.getElementById('infinite-table')
);
