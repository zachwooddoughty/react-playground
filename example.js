var ListItem = React.createClass({displayName: "ListItem",
    getDefaultProps: function() {
        return {
            height: 50,
            lineHeight: "50px"
        }
    },
    render: function() {
        return React.createElement("div", {className: "infinite-list-item", style: 
            {
                height: this.props.height,
                lineHeight: this.props.lineHeight,
                overflow: 'scroll'
            }
        }, 
            React.createElement("div", {style: {height: 400}}, 
            "List Item ", this.props.index
            )
        );
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
        return React.createElement(Infinite, {elementHeight: 50, 
                         containerHeight: window.innerHeight, 
                         infiniteLoadBeginBottomOffset: 200, 
                         onInfiniteLoad: this.handleInfiniteLoad, 
                         loadingSpinnerDelegate: this.elementInfiniteLoad(), 
                         isInfiniteLoading: this.state.isInfiniteLoading, 
                         timeScrollStateLastsForAfterUserScrolls: 1000
                         }, 
                    this.state.elements
                );
    }
});

React.render(React.createElement(InfiniteList, null), document.getElementById('infinite-window-example'));
