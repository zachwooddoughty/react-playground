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
        var shouldUpdate = !(
            nextProps.visibleStart >= this.state.displayStart &&
            nextProps.visibleEnd <= this.state.displayEnd
        ) || (nextProps.totalLength !== this.state.totalLength);

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

        for (i = 0; i < this.props.totalLength; ++i) {
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
            console.log("Row is: " + row);
            rows.push(
                (React.createElement("tr", {style: trStyle, key: i}, row))
            );
        }
        console.log("Rows are: " + rows);
        return(
            React.createElement("table", {style: {width: '100%'}}, 
                rows
            )
        );
        
    }
});

var InfiniteTable = React.createClass({displayName: "InfiniteTable",
    getInitialState: function(){
        return {
            items: this.props.items,
            totalLength: this.props.items.length,
            height: this.props.height,
            visibleStart: 0,
            visibleEnd: 10,
            displayStart: 0,
            displayEnd: 20
        };
    },

    scrollState: function(scroll) {
        var visibleStart =  0; // Math.floor(scroll / this.state.recordHeight);
        var visibleEnd = this.state.totalLength; // Math.min(visibleStart + this.state.recordsPerBody, this.state.total - 1);

        var displayStart = 0; // Math.max(0, Math.floor(scroll / this.state.recordHeight) - this.state.recordsPerBody * 1.5);
        var displayEnd = this.state.totalLength; // Math.min(displayStart + 4 * this.state.recordsPerBody, this.state.total - 1);

        this.setState({
            visibleStart: visibleStart,
            visibleEnd: visibleEnd,
            displayStart: displayStart,
            displayEnd: displayEnd,
            scroll: scroll
        });
    },

    onScroll: function(event) {
        this.scrollState(this.refs.scrollable.getDOMNode().scrollTop);
    },

    render: function() {
        return (
            React.createElement("div", {style: {'overflowX': 'hidden', 'overflowY': 'auto'}, ref: "scrollable", onScroll: this.onScroll}, 
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

var items = [
    [4, 5],
    [],
    [],
    [],
    [5], 
    [2],
    [],
    [6],
    [],
    [3],
    [],
    [],
    [1]
];
// var items = [
//   (<tr><td rowspan={4}>4</td><td rowspan={5}>5</td></tr>),
//   (<tr></tr>),
//   (<tr></tr>),
//   (<tr></tr>),
//   (<tr><td rowspan={5}>5</td></tr>),
//   (<tr><td rowspan={2}>2</td></tr>),
//   (<tr></tr>),
//   (<tr><td rowspan={6}>6</td></tr>),
//   (<tr></tr>),
//   (<tr><td rowspan={3}>3</td></tr>),
//   (<tr></tr>),
//   (<tr></tr>),
//   (<tr><td rowspan={1}>1</td></tr>),
//   (<tr><td rowspan={6} colspan={2}>12</td></tr>),
//   (<tr></tr>),
//   (<tr></tr>),
//   (<tr></tr>),
//   (<tr></tr>),
//   (<tr></tr>),
// ];

React.render(
    React.createElement(InfiniteTable, {
        items: items, 
        height: window.height}
    ),
    document.getElementById('infinite-table')
);
