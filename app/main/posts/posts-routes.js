module.exports = [
    '$stateProvider',
    '$urlMatcherFactoryProvider',
function (
    $stateProvider,
    $urlMatcherFactoryProvider
) {
    $urlMatcherFactoryProvider.strictMode(false);

    $stateProvider
    .state(
        {
            name: 'list', /** I agree, this is a terrible name for this state. Ideas are welcome.**/
            abstract: true,
            controller: require('./views/post-views.controller.js'),
            template: require('./views/main.html'),
            params: {
                view: {value: null, squash: true},
                filterState: {value: null, squash: true},
                savedSearchState: {value: null, squash: true}
            },
            resolve: {
                isLoading: function () {
                    return {state: true};
                },
                collection: ['$transition$', 'CollectionEndpoint', function ($transition$, CollectionEndpoint) {
                    if ($transition$.params().collectionId) {
                        return CollectionEndpoint.get({collectionId: $transition$.params().collectionId}).$promise;
                    }
                }],
                savedSearch: ['$transition$', 'SavedSearchEndpoint', function ($transition$, SavedSearchEndpoint) {
                    if ($transition$.params().savedSearchId) {
                        return SavedSearchEndpoint.get({id: $transition$.params().savedSearchId}).$promise;
                    }

                }]
            },
            onEnter: function ($state, $transition$, PostFilters) {
                console.log($state, $transition$);
                if ($transition$.params().filterState) {
                    PostFilters.setFilters($transition$.params().filterState);
                }
            }
        }
    )
    .state(
        {
            url: '^/savedsearches/:savedSearchId',
            name: 'list.savedsearchRedirector',
            onEnter: function ($state, $transition$, PostFilters, savedSearch) {
                if (savedSearch.view === 'data' || savedSearch.view === 'list') {
                    $state.go('list.data.savedsearch', {savedSearchId: savedSearch.id, view: 'data'});
                } else {
                    $state.go('list.map.savedsearch', {savedSearchId: savedSearch.id, view: 'map'});
                }
            }
        }
    )
    .state(
        {
            url: '^/collections/:collectionId',
            name: 'list.collectionRedirector',
            onEnter: function ($state, $transition$, PostFilters, collection) {
                if (collection.view === 'data' || collection.view === 'list') {
                    $state.go('list.data.collection', {collectionId: collection.id, view: 'data'});
                } else {
                    $state.go('list.map.collection', {collectionId: collection.id, view: 'map'});
                }
            }
        }
    )
    .state(
        {
            url: '/views/data',
            name: 'list.data',
            params: {
                view: {value: 'data', squash: true},
                filterState: {value: null, squash: true},
                savedSearchState: {value: null, squash: true}
            },
            views: {
                listView: {
                    controller: require('./views/post-view-data.controller.js'),
                    template: require('./views/post-view-data.html')
                }
            },
            resolve: {
                //change to selectedPost and refactor the selectedposts in general
                selectedPost: ['$transition$', 'PostEndpoint', function ($transition$, PostEndpoint) {
                    if ($transition$.params().postId) {
                        return PostEndpoint.get({ id: $transition$.params().postId }).$promise;
                    }

                }]
            }
        }
    )
    .state(
        {
            url: '^/savedsearches/:savedSearchId/data',
            name: 'list.data.savedsearch',
            onEnter: function ($state, $transition$, PostFilters, savedSearch) {
                PostFilters.setFilters(savedSearch.filter);
            }
        }
    )
    .state(
        {
            url: '^/collections/:collectionId/data',
            name: 'list.data.collection',
            onEnter: function ($state, $transition$, PostFilters, collection) {
                PostFilters.setMode('collection', collection.id);
            }
        }
    )
    .state(
        {
            name: 'list.map',
            url: '/views/map',
            views: {
                listView: {
                    controller: require('./views/post-view-map.controller.js'),
                    template: function ($state, $transition$) {
                        return '<post-view-map></post-view-map>';
                    }
                }
            },
            params: {
                view: {value: 'map', squash: true},
                filterState: {value: null, squash: true},
                savedSearchState: {value: null, squash: true}
            },
            onEnter: function ($state, $transition$, PostFilters, savedSearch) {
                if (!savedSearch) {
                    PostFilters.resetDefaults();
                }
            }
        }
    )
    .state(
        {
            url: '^/savedsearches/:savedSearchId/map',
            name: 'list.map.savedsearch',
            onEnter: function ($state, $transition$, PostFilters, savedSearch) {
                PostFilters.setFilters(savedSearch.filter);
            }
        }
    )
    .state(
        {
            url: '^/collections/:collectionId/map',
            name: 'list.map.collection',
            onEnter: function ($state, $transition$, PostFilters, collection) {
                PostFilters.setMode('collection', collection.id);
            }
        }
    )

    /** @uirouter-refactor this implies that we will find out selected post details from the data view in /views/data/posts/6539
     at the moment it' not done, just shows the data view. This would fix the massive annoyance that the current selectedPost feature is
     since you won't be sent to a sole post' detail view
     **/
    .state(
        {
            name: 'list.data.detail',
            url: '/posts/:postId',
            template: require('./detail/post-detail-data.html'),
            controller: require('./detail/post-detail-data.controller.js'),
            resolve: {
                //change to selectedPost and refactor the selectedposts in general
                post: ['$transition$', 'PostEndpoint', function ($transition$, PostEndpoint) {
                    return PostEndpoint.get({ id: $transition$.params().postId }).$promise;
                }]
            },
            onEnter: function ($state, $transition$) {
                console.log($state, $transition$);
            }
        }
    )
    /** @uirouter-refactor this implies that we will find out selected post details from the data view in /views/data/posts/6539
     at the moment it' not done, just shows the data view. This would fix the massive annoyance that the current selectedPost feature is
     since you won't be sent to a sole post' detail view
     **/
    .state(
        {
            name: 'list.data.edit',
            url: '/posts/:postId/edit',
            template: require('./modify/post-data-editor.html'),
            controller: require('./modify/post-data-editor.controller.js'),
            resolve: {
                //change to selectedPost and refactor the selectedposts in general
                post: ['$transition$', 'PostEndpoint', function ($transition$, PostEndpoint) {
                    return PostEndpoint.get({ id: $transition$.params().postId }).$promise;
                }]
            },
            onEnter: function ($state, $transition$) {
                console.log($state, $transition$);
            }
        }
    )
    .state(
        {
            name: 'list.noui',
            url: '/map/noui',
            controller: require('./views/post-view-noui.controller.js'),
            template: require('./views/post-view-noui.html'),
            params: {
                view: {value: 'noui', squash: true}
            }
        }
    )
    .state(
        {
            name: 'postDetail',
            url: '/posts/:postId',
            controller: require('./detail/post-detail.controller.js'),
            template: require('./detail/detail.html'),
            resolve: {
                post: ['$transition$', 'PostEndpoint', function ($transition$, PostEndpoint) {
                    return PostEndpoint.get({ id: $transition$.params().postId }).$promise;
                }]
            }
        }
    )
    .state(
        {
            name: 'postCreate',
            url: '/posts/create/:id',
            controller: require('./modify/post-create.controller.js'),
            template: require('./modify/main.html')
        }
    )
    .state(
        {
            name: 'postEdit',
            url: '/posts/:id/edit',
            controller: require('./modify/post-edit.controller.js'),
            template: require('./modify/main.html')
        }
    );

}];
