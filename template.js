var tTemplateEngine = (function (application) {

    // those templates require to stay out of the page, otherwise facebook js sdk will parse them :)
    var templates = {
        facebookRegistration: '<div class="fb-registration" data-fields="[{\'name\':\'name\'}, {\'name\':\'email\'}]"></div>',
        facebookLogin: '<div class="fb-login-button" scope="email">Login with Facebook</div>'
    };

    return {

        get: function (template) {
            return templates[template];
        },

        /**
         *
         * Accepts the id of the template or an html string or a DOM
         * object or a jquery object clones the element, (removes id
         * if *Template and substitute with class *)
         * and finally injects content as defined into 'variables'.
         * It is possible to define html content and/or attributes.
         * template: template id or $obj or obj or string
         * variables: a json object that defines selector and attributes content.
         *
         * Return: $obj the clone object populated with content
         *
         * EXAMPLE:
         *
         * tTemplateEngine.fillTemplate('#menuTemplate',
         * {
         *   'nav a:first': {
         *     html: 'go to homepage',
         *     href: '/',
         *     onclick: 'gaTracker.track(this)',
         *     class: 'homepage_link',
         *     id: 'homepage_link'
         *   }
         * });
         *
         */
        fillTemplate: function (template, variables) {
            var $obj = $(template).clone(), selector, attr;

            if (template.match(/^\#/)) {
                application.get('logger').log('rendering ' + template, null, true);
            } else {
                application.get('logger').log('rendering ' + ($obj.attr('id') || $obj.attr('class')), null, true);
            }

            if ($obj.attr('id') !== undefined && $obj.attr('id').indexOf('Template') !== -1) {
                $obj.addClass($obj.attr('id').replace('Template', ''))
                    .removeAttr('id');
            }

            if (variables !== undefined) {
                if (variables.html !== undefined) {
                    $obj.html(variables.html);
                }

                for (selector in variables) {
                    if (variables.hasOwnProperty(selector)) {

                        if (variables[selector].html) {
                            $obj.find(selector)
                                .html(variables[selector].html);
                        }

                        for (attr in variables[selector]) {
                            if (variables[selector].hasOwnProperty(attr)) {
                                if (attr !== 'html') {
                                    $obj.find(selector)
                                        .attr(attr, variables[selector][attr]);
                                }
                            }
                        }
                    }


                }
            }
            return $obj;
        }
    };
}(application));