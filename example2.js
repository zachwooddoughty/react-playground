var TableBody = React.createClass({displayName: "TableBody",
    getInitialState: function() {
        return {
            shouldUpdate: true,
            totalLength: 0,
            displayStart: 0,
            displayEnd: 0
        };
    },

    componentWillReceiveProps: function(nextProps) {
        var shouldUpdate =
            nextProps.visibleStart < this.state.displayStart
            || nextProps.visibleEnd > this.state.displayEnd
            || nextProps.totalLength !== this.state.totalLength;

        if (shouldUpdate) {
            this.setState({
                shouldUpdate: shouldUpdate,
                totalLength: nextProps.totalLength,
                displayStart: nextProps.displayStart,
                displayEnd: nextProps.displayEnd
            });
        } else {
            this.setState({shouldUpdate: false});
        }
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return this.state.shouldUpdate;
    },

    render: function(){
        var rows = []
        var tdStyle = {border: '1px solid white', width: '50%', background: '#CCCCCC'};
        var trStyle = {height: '50px'};

        console.log("Displaying " + (this.props.displayEnd - this.props.displayStart) + " rows in our table");

        for (var i = this.props.displayStart; i < this.props.displayEnd; ++i) {
            var itemList = this.props.items[i];
            var row;
            if (itemList.length == 0){
                row = "";
            } else if (itemList.length == 1){
                item = itemList[0];
                row = (React.createElement("td", {style: tdStyle, rowSpan: item}, item));
            } else {
                item1 = itemList[0];
                item2 = itemList[1];
                row = (React.createElement("div", null, React.createElement("td", {style: tdStyle, rowSpan: item1}, item1), React.createElement("td", {style: tdStyle, rowSpan: item2}, item2)));
            }
            rows.push(
                (React.createElement("tr", {style: trStyle, key: i}, row))
            );
        }
        return(
            React.createElement("table", {style: {width: '100%'}}, 
                React.createElement("tbody", null, rows)
            )
        );
        
    }
});

var InfiniteTable = React.createClass({displayName: "InfiniteTable",
    getInitialState: function(){
        var chunkHeight = 50 * 13;
        var chunksPerPage = 1;  // Math.floor(this.props.height / chunkHeight);
        return {
            items: this.props.items,
            totalLength: this.props.items.length,
            height: this.props.height,
            itemsPerChunk: 13,
            chunksPerPage: chunksPerPage,
            visibleStart: 0,
            visibleEnd: 13 * chunksPerPage,
            displayStart: 0,
            displayEnd: 13 * chunksPerPage * 3
        };
    },

    scrollState: function(scroll) {
        console.log("We've scrolled to " + scroll);
        var itemsPerChunk = this.state.itemsPerChunk;

        var visibleStart = itemsPerChunk * Math.floor(scroll / this.state.chunksPerPage);
        var visibleEnd = Math.min(itemsPerChunk * (visibleStart + 2), this.state.totalLength - 1);

        var displayStart = Math.max(0, itemsPerChunk * (Math.floor(scroll / this.state.chunksPerPage) - 1));
        var displayEnd = Math.min(displayStart + 3 * itemsPerChunk * this.state.chunksPerPage, this.state.totalLength - 1);

        this.setState({
            visibleStart: visibleStart,
            visibleEnd: visibleEnd,
            displayStart: displayStart,
            displayEnd: displayEnd,
            scroll: scroll
        });
    },

    onScroll: function(event) {
        this.scrollState(event.srcElement.body.scrollTop);
    },

    componentDidMount: function(){
        window.addEventListener('scroll', this.onScroll);
    },

    componentWillUnmount: function(){
        window.removeEventListener('scroll', this.onScroll);
    },

    render: function() {
        return (
            React.createElement("div", {style: {'overflowX': 'hidden', 'overflowY': 'auto', top: 26}, ref: "scrollable"}, 
                React.createElement(TableBody, {
                    items: this.state.items, 
                    totalLength: this.state.totalLength, 
                    visibleStart: this.state.visibleStart, 
                    visibleEnd: this.state.visibleEnd, 
                    displayStart: this.state.displayStart, 
                    displayEnd: this.state.displayEnd}
                )
            )
        );
    }
});

var items = [];
for (i = 0; i < 1000; i++){
    items.push([4, 5], [], [], [], [5], [2], [], [6], [], [3], [], [], [1]);
}

React.render(
    React.createElement(InfiniteTable, {
        items: items, 
        height: 600}
    ),
    document.getElementById('infinite-table')
);
