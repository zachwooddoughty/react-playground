var TableBody = React.createClass({
    getInitialState: function() {
        return {
            shouldUpdate: true,
            firstRenderedPixel: 0,
            lastRenderedPixel: 0,
            scrollBuffer: 500
        };
    },

    componentWillReceiveProps: function(nextProps) {
        var realPosition = nextProps.realPosition;
        var newFirstRenderedPixel = this.state.firstRenderedPixel;
        var newLastRenderedPixel = this.state.lastRenderedPixel;

        console.log("Is " + realPosition + "<" + this.state.firstRenderedPixel + "+500? "
        + "Is " + realPosition + ">" + this.state.lastRenderedPixel + "-500? "
        );

        var shouldUpdate = false;
        if (realPosition < this.state.firstRenderedPixel + 500){
            shouldUpdate = true;
            newFirstRenderedPixel = Math.max(0, this.state.firstRenderedPixel - 2000);
            newLastRenderedPixel = this.state.firstRenderedPixel + 3000;
        }
        if (realPosition > this.state.lastRenderedPixel - 500){
            shouldUpdate = true;
            newFirstRenderedPixel = Math.max(0, this.state.lastRenderedPixel - 1000);
            newLastRenderedPixel = this.state.lastRenderedPixel + 3000;
        }
        // var shouldUpdate = 
        //     (this.state.firstRenderedPixel > 0 && realPosition < this.state.firstRenderedPixel + this.state.scrollBuffer)
        //     || realPosition > this.state.lastRenderedPixel - this.state.scrollBuffer;

        // console.log("Is " + realPosition + "<" + this.state.firstRenderedPixel + "+500? "
        // + "Is " + realPosition + ">" + this.state.lastRenderedPixel + "-500? "
        // + "Should we update? " + (shouldUpdate ?
        //     "yup! We're going to " + nextProps.firstRenderedPixel + ", " + nextProps.lastRenderedPixel
        //     : "nope.")
        // );
        if (shouldUpdate) {
            this.setState({
                shouldUpdate: shouldUpdate,
                firstRenderedPixel: newFirstRenderedPixel,
                lastRenderedPixel: newLastRenderedPixel
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
        var tdStyle = {border: '1px solid white', width: '50%', background: '#CCCCCC'};
        var trStyle = {height: rowHeight + 'px'};

        console.log("Displaying from " + this.props.firstRenderedPixel + " to " + this.props.lastRenderedPixel);
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
                item = itemList[0];
                if (leftDepth <= rightDepth){
                    leftDepth += item * rowHeight;
                    leftOverhang = item - 1;
                } else {
                    rightDepth += item * rowHeight;
                    rightOverhang = item - 1;
                }
                row = (<td style={tdStyle} rowSpan={item}>{item}</td>);
            } else {
                item1 = itemList[0];
                leftDepth += item1 * rowHeight;
                leftOverhang = item1 - 1;
                item2 = itemList[1];
                rightDepth += item2 * rowHeight;
                rightOverhang = item2 - 1;
                row = (<div><td style={tdStyle} rowSpan={item1}>{item1}</td><td style={tdStyle} rowSpan={item2}>{item2}</td></div>);
            }
            if (Math.max(leftDepth, rightDepth) > this.props.firstRenderedPixel){
                rows.push(
                    (<tr style={trStyle} key={i}>{row}</tr>)
                );
            }
            i++;
            if (i >= this.props.items.length){
                console.log("Oh no! We've run out of items!");
            }
        }
        return(
            <table style={{width: '100%'}}>
                <tbody>{rows}</tbody>
            </table>
        );
        
    }
});

var InfiniteTable = React.createClass({
    getInitialState: function(){
        var itemsPerPage = 20;  // Math.floor(this.props.height / chunkHeight);
        return {
            items: this.props.items,
            totalLength: this.props.items.length,
            height: this.props.height,
            itemsPerPage: itemsPerPage,
            // firstLoadedPixel: 0,
            // lastLoadedPixel: 5000,
            firstRenderedPixel: 0,
            lastRenderedPixel: 3000,
            scrollPosition: 0,
            realPosition: 0,
        };
    },

    scrollState: function(scrollPosition) {
        var realPosition = this.state.firstRenderedPixel + scrollPosition;
        var newFirstRenderedPixel = this.state.firstRenderedPixel;
        var newLastRenderedPixel = this.state.lastRenderedPixel;

        if (realPosition < this.state.firstRenderedPixel + 500){
            newFirstRenderedPixel = Math.max(0, this.state.firstRenderedPixel - 2000);
            newLastRenderedPixel = this.state.firstRenderedPixel + 3000;
        }
        if (realPosition > this.state.lastRenderedPixel - 500){
            newFirstRenderedPixel = Math.max(0, this.state.lastRenderedPixel - 1000);
            newLastRenderedPixel = this.state.lastRenderedPixel + 3000;
        }

        this.setState({
            scrollPosition: scrollPosition,
            realPosition: realPosition,
            firstRenderedPixel: newFirstRenderedPixel,
            lastRenderedPixel: newLastRenderedPixel
        });
    },

    onScroll: function(event) {
        this.scrollState(event.srcElement.body.scrollTop);
    },

    componentDidMount: function(){
        window.addEventListener('scroll', this.onScroll);
        // Scroll down to hide the "Loading..." header
        // document.body.scrollTop = 50;
    },

    componentWillUnmount: function(){
        window.removeEventListener('scroll', this.onScroll);
    },

    render: function() {
        return (
            <div style={{'overflowX': 'hidden', 'overflowY': 'auto', top: 26}} ref="scrollable">
                <TableBody
                    items={this.state.items}
                    firstRenderedPixel={this.state.firstRenderedPixel}
                    lastRenderedPixel={this.state.lastRenderedPixel}
                    scrollPosition={this.state.scrollPosition}
                    realPosition={this.state.realPosition}
                    height={this.state.height}
                />
            </div>
        );
    }
});

var items = [];
for (i = 0; i < 100000; i++){
    items.push([4, 5], [], [], [], [5], [2], [], [6], [], [3], [], [], [1]);
}

React.render(
    <InfiniteTable
        items={items}
        height={window.innerHeight}
    />,
    document.getElementById('infinite-table')
);
