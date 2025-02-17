FROM nginx:1.25.3
ADD build /usr/share/nginx/html
RUN rm etc/nginx/conf.d/default.conf
COPY nginx.conf etc/nginx/conf.d/

COPY entrypoint.sh /entrypoint.sh
RUN chmod 755 /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]
CMD ["nginx", "-g", "daemon off;"]