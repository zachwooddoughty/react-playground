var ListItem = React.createClass({displayName: "ListItem",
    getDefaultProps: function() {
        return {
            height: 400,
            lineHeight: "400px"
        }
    },
    render: function() {
        return React.createElement("div", {className: "infinite-list-item", style: 
            {
                height: this.props.height,
                lineHeight: this.props.lineHeight,
                overflow: 'hidden'
            }
        }, 
            React.createElement("div", null, "List Item ", this.props.index)
        );
    }
});

var DoubleInfinite = React.createClass({displayName: "DoubleInfinite",
    render: function() {
        var tdStyle = {maxWidth: '50%'};
        return React.createElement("table", null, React.createElement("tr", null, 
                 React.createElement("td", {style: tdStyle}, React.createElement(InfiniteList, null)), 
                 React.createElement("td", {style: tdStyle}, React.createElement(InfiniteList, null))
               ))
    }
});

var InfiniteList = React.createClass({displayName: "InfiniteList",
    getInitialState: function() {
        return {
            elements: this.buildElements(0, 50),
            isInfiniteLoading: false
        }
    },

    buildElements: function(start, end) {
        var elements = [];
        for (var i = start; i < end; i++) {
            elements.push(React.createElement(ListItem, {key: i, index: i}))
        }
        return elements;
    },

    handleInfiniteLoad: function() {
        var that = this;
        this.setState({
            isInfiniteLoading: true
        });
        setTimeout(function() {
            var elemLength = that.state.elements.length,
                newElements = that.buildElements(elemLength, elemLength + 100);
            that.setState({
                isInfiniteLoading: false,
                elements: that.state.elements.concat(newElements)
            });
        }, 2500);
    },

    elementInfiniteLoad: function() {
        return React.createElement("div", {className: "infinite-list-item"}, 
            "Loading..."
        );
    },

    render: function() {
        return React.createElement(Infinite, {
                          elementHeight: 400, 
                          containerHeight: window.innerHeight, 
                          infiniteLoadBeginBottomOffset: 200, 
                          onInfiniteLoad: this.handleInfiniteLoad, 
                          loadingSpinnerDelegate: this.elementInfiniteLoad(), 
                          isInfiniteLoading: this.state.isInfiniteLoading, 
                          timeScrollStateLastsForAfterUserScrolls: 1000
                          }, 
                     this.state.elements
                 )
               ;
    }
});

React.render(React.createElement(DoubleInfinite, null), document.getElementById('double-infinite'));
